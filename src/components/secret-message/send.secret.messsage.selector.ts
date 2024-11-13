import { useContext, useState } from 'react';
import { useAxios } from '../../util/useAxios';
import { is_android } from '../../util/osCheck';
import RNFetchBlob from 'rn-fetch-blob';
import logEvent from '../../analytics/analytics';
import {
  MatchDecisionResultEvent,
  SecretMessageEvent,
  UserInteractionEvent,
} from '../../analytics/analytics.event';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { IBlockedProfile, IPublicProfile } from '@match-app/shared';
import {
  PN_PERMISSION_AFTER_FIRST_MATCH,
  TRUE_STRING,
} from '../deck/deck.selector.component';
import { ChatContext } from '../../states/chat.state';
import { CatchModalContext } from '../deck/catch-modal/catch.modal.context';
import { ProfileContext } from '../../states/profile.state';
import { useFetchProfile } from '../../scenes/profile/profile.selector';

export const useSendSecretMessageSelector = (
  profile: IPublicProfile | IBlockedProfile,
) => {
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState('');
  const { refreshChatList } = useContext(ChatContext);
  const { setCanUndo } = useContext(ProfileContext);
  const { openCatchModal } = useContext(CatchModalContext);
  const [loading, setLoading] = useState(false);
  const { goBack } = useNavigation();
  const { fetchProfile } = useFetchProfile();
  const sendMessage = useAxios({
    url: `matching/secret-message/${profile.id}`,
    method: 'POST',
    onError: ({ response }) => {
      if (response?.data) {
        console.error(JSON.stringify(response.data));
        setError(response.data);
      }
      setLoading(false);
    },
    onSuccess: async ({ data: { matchId } }) => {
      if (matchId) {
        try {
          const hasPNPermissionAppearedAfterMatch = await AsyncStorage.getItem(
            PN_PERMISSION_AFTER_FIRST_MATCH,
          );
          if (hasPNPermissionAppearedAfterMatch !== TRUE_STRING) {
            AsyncStorage.setItem(PN_PERMISSION_AFTER_FIRST_MATCH, TRUE_STRING);
            messaging().requestPermission();
          }
          logEvent(MatchDecisionResultEvent.newMatch);
        } finally {
          refreshChatList();
          await fetchProfile();
          setCanUndo(false);
          setLoading(false);
          goBack();
          openCatchModal({
            name: profile.name,
            isClickedOn: true,
            matchId: matchId,
            profileId: profile.id,
            thumbnailUrl: profile.pictures[0].thumbnailUrl,
          });
        }
      } else {
        setLoading(false);
        goBack();
      }
    },
  })[1];

  const onErrorDismiss = () => {
    setError(null);
  };
  const onSend = async () => {
    setLoading(true);
    await sendMessage({ data: { text: message } });
    logEvent(UserInteractionEvent.send + '_' + SecretMessageEvent.text);
    return true;
  };

  const onAudio = async (audioFilePath: string, duration: number) => {
    const filePath = is_android ? `file://${audioFilePath}` : audioFilePath;
    const localFile = await RNFetchBlob.fs.readFile(filePath, 'base64');
    const formData = new FormData();
    formData.append('duration', duration);
    formData.append('file', {
      uri: is_android ? filePath : 'data:audio/mpeg;base64,' + localFile,
      type: 'audio/mpeg',
      name: 'attachment-audio',
    });
    setLoading(true);
    await sendMessage({
      data: formData,
    });
    logEvent(UserInteractionEvent.send + '_' + SecretMessageEvent.audio);
  };

  return {
    onSend,
    setMessage,
    onErrorDismiss,
    onAudio,
    message,
    loading,
    error,
  };
};
