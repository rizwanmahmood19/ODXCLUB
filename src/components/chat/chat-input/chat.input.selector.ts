import { useContext, useEffect, useState } from 'react';
import { ChatInputProps } from './chat.input.component';
import RNFetchBlob from 'rn-fetch-blob';
import { ProfileContext } from '../../../states/profile.state';
import { LocalizationContext } from '../../../services/LocalizationContext';
import { useAxios } from '../../../util/useAxios';
import { useMatchListItemSelector } from '../../match-list/match.list.item.selector';
import logEvent from '../../../analytics/analytics';
import {
  MessageEvent,
  UserInteractionEvent,
} from '../../../analytics/analytics.event';
import { RNFFmpeg, RNFFprobe } from 'react-native-ffmpeg';
import { Alert } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { LocalAttachment } from './saved.attachment.list.component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { is_android, is_iOS } from '../../../util/osCheck';
import {
  AttachmentAudioUploadResponse,
  IAttachmentPicture,
  IAttachmentVideo,
  MAX_VIDEO_BYTE_SIZE,
  MAX_VIDEO_SECONDS,
} from '@match-app/shared';
import { removeFile } from '../../../util/removeFile';
import { ChatContext } from '../../../states/chat.state';
import { ASYNC_STORAGE_KEYS } from '../../../constants';
import { Channel } from 'stream-chat';
import {
  extractDuration,
  getVideoUri,
  purgeRecentAttachmentFiles,
  removeFilePrefixIfNecessary,
} from './util';

const MAX_STORED_ATTACHMENTS = 10;

export const useChatInputSelector = (props: ChatInputProps) => {
  const {
    matchIds,
    channels,
    matchItem,
    disabled,
    isPassionAlert,
    handleMessageSent,
    firstMessageInternalHandler,
  } = props;

  const [message, setMessage] = useState('');
  const { onFirstMessage } = useMatchListItemSelector();
  const { l10n } = useContext(LocalizationContext);
  const [attachmentsListOpen, setAttachmentsListOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [savedAttachments, setSavedAttachments] = useState<
    Array<LocalAttachment>
  >([]);
  const [selectedAttachment, setSelectedAttachment] =
    useState<LocalAttachment>();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAttachment, setIsProcessingAttachment] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(!!matchItem);
  const {
    state: { profile },
  } = useContext(ProfileContext);
  const { refreshChatList } = useContext(ChatContext);
  const toggleAttachmentsList = () =>
    setAttachmentsListOpen((previousState) => !previousState);
  const [, uploadPicture] = useAxios({
    method: 'POST',
    url: 'conversation/attachment/picture',
    onError: console.error,
  });
  const [, uploadVideo] = useAxios({
    method: 'POST',
    url: 'conversation/attachment/video',
    onError: console.error,
  });

  const [, uploadAudio] = useAxios<AttachmentAudioUploadResponse>({
    method: 'POST',
    url: 'conversation/attachment/audio',
  });

  const SAVED_ATTACHMENTS_KEY = `${ASYNC_STORAGE_KEYS.SAVED_ATTACHMENTS_BASE}${
    profile?.id || 'profileId'
  }`;
  const basedir = `${RNFetchBlob.fs.dirs.DocumentDir}/matchapp/${
    profile?.id || 'profileId'
  }`;
  const recentAttachmentsDir = `${basedir}/recent-attachments`;
  const recentThumbnailsDir = `${basedir}/recent-thumbnails`;
  const videoTempDir = `${basedir}/video-tmp`;

  const handlePictureUpload = async (
    attachment: LocalAttachment,
  ): Promise<IAttachmentPicture[]> => {
    const formData = new FormData();
    matchIds.forEach((matchId, index) => {
      formData.append(`matchIds[${index}]`, matchId);
    });
    formData.append('file', {
      uri: is_android ? `file:///${attachment.filePath}` : attachment.filePath,
      type: 'image/jpeg',
      name: 'attachment-image',
    });
    const { error, response } = await uploadPicture({
      headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Length': (attachment as any).size || undefined,
      },
      data: formData,
    });
    if (error || !response.data) {
      setErrorMessage(l10n.conversation.fileUploadFailed);
      return [];
    }
    return response.data.attachments;
  };

  const handleAudio = async (audioFilePath: string, duration: number) => {
    setIsLoading(true);
    const filePath = is_android ? `file://${audioFilePath}` : audioFilePath;
    const localFile = await RNFetchBlob.fs.readFile(filePath, 'base64');
    const formData = new FormData();
    matchIds.forEach((matchId, index) => {
      formData.append(`matchIds[${index}]`, matchId);
    });
    formData.append('file', {
      uri: is_android ? filePath : 'data:audio/mpeg;base64,' + localFile,
      type: 'audio/mpeg',
      name: 'attachment-audio',
    });
    const { error, response } = await uploadAudio({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
    if (
      error ||
      !response.data ||
      (!Array.isArray(response.data) &&
        response.data.attachments.length < matchIds.length)
    ) {
      setErrorMessage(l10n.conversation.fileUploadFailed);
      setIsLoading(false);
      return;
    }
    const { attachments } = response.data;
    const messages: any[] = matchIds.map((_, i) => {
      const attachment = attachments[i];
      return {
        attachments: [
          {
            type: 'audio',
            asset_url: attachment.audioUrl,
            fileName: attachment.fileName,
            duration,
          },
        ],
      };
    });
    await sendMessagesInternal(messages);
    logEvent(UserInteractionEvent.send + '_' + MessageEvent.audio);
    await removeFile(audioFilePath);
  };

  const handleVideoUpload = async (
    attachment: LocalAttachment,
  ): Promise<IAttachmentVideo[]> => {
    const formData = new FormData();
    matchIds.forEach((matchId, index) => {
      formData.append(`matchIds[${index}]`, matchId);
    });
    const videoUri = getVideoUri(attachment.filePath);
    // check produced video size, so it won't fail against the backend.
    const { size } = await RNFetchBlob.fs.stat(
      removeFilePrefixIfNecessary(videoUri),
    );
    if (size > MAX_VIDEO_BYTE_SIZE) {
      Alert.alert(
        l10n.conversation.video.fileTooBig.title,
        l10n.conversation.video.fileTooBig.message,
      );
      return [];
    }
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video',
    });
    formData.append('thumbnail', {
      uri: is_android
        ? `file:///${attachment.thumbnailPath}`
        : attachment.thumbnailPath,
      type: 'image/jpeg',
      name: 'thumbnail',
    });
    const { error, response } = await uploadVideo({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
    if (error || !response.data) {
      console.error(error?.toJSON());
      setErrorMessage(l10n.conversation.video.uploadError);
      return [];
    }
    return response.data.attachments;
  };

  const ensureDirectoriesExist = async () => {
    if (!(await RNFetchBlob.fs.exists(recentAttachmentsDir))) {
      await RNFetchBlob.fs.mkdir(recentAttachmentsDir);
    }
    if (!(await RNFetchBlob.fs.exists(recentThumbnailsDir))) {
      await RNFetchBlob.fs.mkdir(recentThumbnailsDir);
    }
  };

  const saveAttachmentLocally = async (attachment: LocalAttachment) => {
    try {
      const savedAttachmentsUpdate = [...savedAttachments];
      const savedAttachment =
        attachment.localId && attachment.usedAtTimestamp
          ? savedAttachmentsUpdate.find((x) => x.localId === attachment.localId)
          : undefined;
      if (savedAttachment) {
        savedAttachment.usedAtTimestamp = new Date().getTime();
      } else {
        // create new entry + move files
        await ensureDirectoriesExist();
        const localAttachment: LocalAttachment = {
          usedAtTimestamp: new Date().getTime(),
          localId: `${new Date().getTime()}`,
          isVideo: attachment.isVideo,
          filePath: `${recentAttachmentsDir}/${new Date().getTime()}.${attachment.filePath
            .split('.')
            .pop()}`,
        };
        await RNFetchBlob.fs.cp(
          is_android
            ? attachment.filePath
            : attachment.filePath.replace('file://', ''),
          localAttachment.filePath,
        );

        if (attachment.thumbnailPath) {
          localAttachment.thumbnailPath = `${recentThumbnailsDir}/${new Date().getTime()}.jpg`;
          await RNFetchBlob.fs.cp(
            attachment.thumbnailPath,
            localAttachment.thumbnailPath,
          );
        }
        savedAttachmentsUpdate.push(localAttachment);
      }
      savedAttachmentsUpdate.sort(
        (a, b) => (b.usedAtTimestamp || 0) - (a.usedAtTimestamp || 0),
      );
      savedAttachmentsUpdate.splice(MAX_STORED_ATTACHMENTS);
      setSavedAttachments(savedAttachmentsUpdate);
      await AsyncStorage.setItem(
        SAVED_ATTACHMENTS_KEY,
        JSON.stringify(savedAttachmentsUpdate),
      );
      await purgeRecentAttachmentFiles(
        recentAttachmentsDir,
        recentThumbnailsDir,
        savedAttachmentsUpdate,
      );
    } catch (e) {
      // TODO MATCH-265: Handle error
      console.error(e);
      Sentry.captureException(e);
    }
  };

  const verifyEmptyChannel = (
    previousMessageCount: number,
    channel: Channel,
  ) => {
    return (
      previousMessageCount === 0 ||
      (channel.data?.smOrigin && previousMessageCount <= 1) ||
      channel.data?.secretMessage
    );
  };

  const handleFirstMessage = () => {
    if (isFirstMessage) {
      setIsFirstMessage(false);
      if (typeof firstMessageInternalHandler === 'function') {
        firstMessageInternalHandler();
      }
    }
  };

  const sendMessagesInternal = async (channelMessages: any[]) => {
    await Promise.all(
      channels.map(async (channel, index) => {
        try {
          const previousMessageCount = channel?.state?.messages?.length || 0;
          const isChannelEmpty = verifyEmptyChannel(
            previousMessageCount,
            channel,
          );

          await channel.sendMessage(channelMessages[index]);

          if (
            channelMessages[index].text &&
            channelMessages[index].length > 0
          ) {
            logEvent(UserInteractionEvent.send + '_' + MessageEvent.text);
          }
          if (
            (isFirstMessage || isChannelEmpty) &&
            typeof channel.data?.matchId === 'string'
          ) {
            await onFirstMessage(channel.data.matchId);
            await channel.show();
            if (typeof refreshChatList === 'function') {
              refreshChatList();
            }
          }
        } catch (error) {
          console.error('error', error);
        }
      }),
    );
    if (selectedAttachment) {
      await saveAttachmentLocally(selectedAttachment);
    }
    handleFirstMessage();
    setSelectedAttachment(undefined);
    setMessage('');
    if (handleMessageSent) {
      handleMessageSent();
    }
    setIsLoading(false);
    return true;
  };

  const sendMessage = async () => {
    setIsLoading(true);
    const channelMessages: any[] = matchIds.map(() => ({ text: message }));
    if (isPassionAlert) {
      logEvent(UserInteractionEvent.send + '_' + MessageEvent.passionAlert);
      channelMessages.forEach((m) => {
        m.isPassionAlert = true;
        if (!m.text?.length) {
          m.text = ' ';
        }
      });
    }
    if (selectedAttachment) {
      if (selectedAttachment.isVideo) {
        const uploadedAttachments = await handleVideoUpload(selectedAttachment);
        if (!uploadedAttachments.length) {
          setIsLoading(false);
          return false;
        }
        uploadedAttachments?.forEach(
          ({ thumbnailUrl, fileName, videoUrl }, index) => {
            channelMessages[index].attachments = [
              {
                type: 'video',
                fileName,
                asset_url: videoUrl,
                thumb_url: thumbnailUrl,
              },
            ];
          },
        );
        logEvent(UserInteractionEvent.send + '_' + MessageEvent.video);
      } else {
        const uploadedAttachments = await handlePictureUpload(
          selectedAttachment,
        );
        if (!uploadedAttachments.length) {
          setIsLoading(false);
          return false;
        }
        uploadedAttachments?.forEach(
          ({ thumbnailUrl, pictureUrl, fileName }, index) => {
            channelMessages[index].attachments = [
              {
                type: 'image',
                fileName,
                image_url: pictureUrl,
                asset_url: pictureUrl,
                thumb_url: thumbnailUrl,
              },
            ];
          },
        );
        logEvent(UserInteractionEvent.send + '_' + MessageEvent.photo);
      }
    }
    return sendMessagesInternal(channelMessages);
  };

  const handleRemovePicture = () => {
    setSelectedAttachment(undefined);
    setAttachmentsListOpen(true);
  };

  const handleSelectSavedAttachment = (attachment: LocalAttachment) => {
    setSelectedAttachment({ ...attachment });
    setAttachmentsListOpen(false);
  };

  const handleImageSelect = (filePath: string) => {
    setSelectedAttachment({ filePath });
    setAttachmentsListOpen(false);
  };

  const handleVideoProcessingError = (rc: string | number) => {
    Alert.alert(
      l10n.conversation.video.processingError.title,
      l10n.conversation.video.processingError.message,
    );
    console.error(`Failed processing video. Library resultCode: ${rc}`);
    Sentry.captureException(
      `Failed processing video. Library resultCode: ${rc}`,
    );
    setIsProcessingAttachment(false);
    setAttachmentsListOpen(false);
  };

  const handleVideo = async (filePath: string) => {
    setIsProcessingAttachment(true);
    try {
      if (!(await RNFetchBlob.fs.exists(videoTempDir))) {
        await RNFetchBlob.fs.mkdir(videoTempDir);
      }
      const finalFilePath = `${videoTempDir}/${new Date().getTime()}.mp4`;

      const videoInfo = await RNFFprobe.getMediaInformation(filePath);
      const mediaInfos = videoInfo.getMediaProperties();
      const videoFileInfo = await RNFetchBlob.fs.stat(
        removeFilePrefixIfNecessary(filePath),
      );
      if (!videoInfo) {
        handleVideoProcessingError('COULD NOT GET VIDEOS MEDIA_INFO');
        return;
      }

      const duration = extractDuration(mediaInfos);
      if (!duration) {
        handleVideoProcessingError('COULD NOT GET VIDEOS MEDIA_INFO DURATION');
        return;
      }

      let ffmpegArgs = '';
      // check if duration (in ms) is > max seconds + small buffer
      if (duration > MAX_VIDEO_SECONDS * 1000 + 2000) {
        try {
          await new Promise((resolve, reject) => {
            Alert.alert(
              l10n.conversation.video.tooLong.title,
              l10n.conversation.video.tooLong.message,
              [
                {
                  onPress: () => resolve(undefined),
                  text: l10n.conversation.video.tooLong.confirm,
                },
                {
                  onPress: () => reject(),
                  text: l10n.conversation.video.tooLong.cancel,
                },
              ],
            );
          });
          ffmpegArgs = '-to 120';
        } catch (ignored) {
          setIsProcessingAttachment(false);
          setIsLoading(false);
          return;
        }
      }
      if (videoFileInfo.size > 50000) {
        ffmpegArgs = `-preset ultrafast -crf 26 ${ffmpegArgs} -vf scale=-2:720 `;
      }
      // convert .mov to .mp4 for iOS + compress + cut at 120seconds + reduce size to 720p
      const command = is_iOS
        ? `-i ${filePath} -c:v h264 -c:a aac ${ffmpegArgs} ${finalFilePath}`
        : `-i ${filePath} ${ffmpegArgs} ${finalFilePath}`;
      const videoResult = await RNFFmpeg.execute(command);
      if (videoResult !== 0) {
        handleVideoProcessingError(videoResult);
        Sentry.captureException(
          `Failed processing video. Library resultCode: ${videoResult}`,
        );
        return;
      }
      if (__DEV__) {
        console.log(
          `reduced video filesize to ${
            (await RNFetchBlob.fs.stat(finalFilePath)).size
          }`,
        );
      }
      if (!(await RNFetchBlob.fs.exists(recentThumbnailsDir))) {
        await RNFetchBlob.fs.mkdir(recentThumbnailsDir);
      }
      // create thumbnail with ffmpeg and save it in thumbnails dir
      const thumbnailPath = `${recentThumbnailsDir}/${new Date().getTime()}.jpg`;
      const thumbResult = await RNFFmpeg.execute(
        `-ss 0 -i ${finalFilePath} -vframes 1 -an -s 220x220 -ss 0 ${thumbnailPath}`,
      );
      if (thumbResult !== 0) {
        handleVideoProcessingError(thumbResult);
        Sentry.captureException(
          `Failed generating thumbnail for video. Library resultCode: ${thumbResult}`,
        );
        return;
      }
      RNFFmpeg.cancel(); // clean up ffmpeg instance
      setSelectedAttachment({
        isVideo: true,
        filePath: finalFilePath,
        thumbnailPath,
      });
    } catch (e) {
      console.error(e);
      Sentry.captureException(e);
    }
    setIsProcessingAttachment(false);
    setAttachmentsListOpen(false);
  };

  const getSavedAttachments = async (): Promise<LocalAttachment[]> => {
    try {
      const attachmentsString = await AsyncStorage.getItem(
        SAVED_ATTACHMENTS_KEY,
      );
      if (!attachmentsString) {
        return [];
      }
      const attachments = JSON.parse(attachmentsString) as LocalAttachment[];
      if (!Array.isArray(attachments) || !attachments.length) {
        return [];
      }
      // sort attachments by date
      attachments.sort(
        (a, b) => (b.usedAtTimestamp || 0) - (a.usedAtTimestamp || 0),
      );
      const [filePaths, thumbnailPaths] = await Promise.all([
        RNFetchBlob.fs.ls(recentAttachmentsDir),
        RNFetchBlob.fs.ls(recentThumbnailsDir),
      ]);
      // ensure that attachment files exist + remove any entries without corresponding files
      const verifiedAttachments = attachments.reduce((acc, attachment) => {
        if (!filePaths.find((x) => attachment.filePath.indexOf(x) !== -1)) {
          return acc;
        }
        if (
          attachment.thumbnailPath &&
          !thumbnailPaths.find(
            (x) => attachment.thumbnailPath!.indexOf(x) !== -1,
          )
        ) {
          return acc;
        }
        acc.push(attachment);
        return acc;
      }, [] as LocalAttachment[]);
      if (verifiedAttachments.length !== attachments.length) {
        await AsyncStorage.setItem(
          SAVED_ATTACHMENTS_KEY,
          JSON.stringify(verifiedAttachments),
        );
      }
      return verifiedAttachments;
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    ensureDirectoriesExist().then(() => {
      getSavedAttachments().then((result) => {
        setSavedAttachments(result);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  return {
    message,
    savedAttachments,
    selectedAttachment,
    attachmentsListOpen,
    errorMessage,
    isDisabled:
      isLoading ||
      ((!message || message.length === 0) && !selectedAttachment) ||
      !!disabled,
    isLoading,
    setIsLoading,
    handleRemovePicture,
    handleMessageChange: setMessage,
    handleSelectSavedAttachment,
    handleImageSelect,
    handleVideo,
    handleAudio,
    isProcessingAttachment,
    toggleAttachmentsList,
    setErrorMessage,
    sendMessage,
  };
};
