import { RefObject, useEffect, useRef, useState } from 'react';
import {
  TrackEventCbArgs,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import { VideoCallModalProps } from './video-call.modal';
import {
  AppState,
  AppStateStatus,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useAxios } from '../../util/useAxios';
import messaging from '@react-native-firebase/messaging';
import { PUSH_NOTIFICATION_ACTIONS } from '@match-app/shared';
import IdleTimerManager from 'react-native-idle-timer';
import { Player } from '@react-native-community/audio-toolkit';
import RingerMode from 'react-native-ringer-mode';
import { is_iOS } from '../../util/osCheck';
import { playStopAndDestroy } from '../../util/audioUtils';

export const useVideoCallModalSelector = (
  props: VideoCallModalProps,
  twilioVideo: RefObject<TwilioVideo>,
) => {
  const { isCaller, matchState, onClose, channel } = props;
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [status, setStatus] = useState('');
  const [roomParticipant, setRoomParticipant] = useState();
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [timer, setTimer] = useState(-1);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [buttonTimer, setButtonTimer] = useState(5);
  const audioPlayer = useRef(
    new Player('video_call_calling.wav', {
      autoDestroy: false,
      category: 2, // Ambient, should not play for iOS if phone is in silent mode
    }),
  );
  audioPlayer.current.looping = true;

  // Workaround for iOS silent mode. We need to play an audio with the Playback
  // category to be able to continue playing the audio from the messages
  const silentAudioPlayer = useRef<Player>(
    new Player('silent.wav', { autoDestroy: true, category: 1 }),
  );
  const playSilentAudio = () => {
    if (is_iOS) playStopAndDestroy(silentAudioPlayer.current);
  };

  const isMounted = useRef(true);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'inactive') {
        // ONLY WORKS FOR IOS
        audioPlayer.current.stop();
        audioPlayer.current.destroy();
        playSilentAudio();
        twilioVideo.current?.disconnect();
        console.log('disconnected, app closed');
      }
    };
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // check for cancel push notification
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { data } = remoteMessage;
      if (
        data?.type === PUSH_NOTIFICATION_ACTIONS.VIDEO_CALL_CANCELLED &&
        data?.matchId === matchState?.matchId
      ) {
        twilioVideo.current?.disconnect();
        setStatus('disconnected');
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // keeps app awake during video call
    IdleTimerManager.setIdleTimerDisabled(true);
    return () => IdleTimerManager.setIdleTimerDisabled(false);
  }, []);

  const [, initiateCall] = useAxios({
    url: `video-call/initiate/${matchState?.matchId}`,
    method: 'GET',
    initial: false,
  });

  const [, inviteToCall] = useAxios({
    url: `video-call/invite/${matchState?.matchId}/${channel?.id}`,
    method: 'GET',
    initial: false,
    onSuccess: () => setTimer(30),
  });

  const [, cancelCall] = useAxios({
    url: `video-call/cancel/${matchState?.matchId}`,
    method: 'GET',
    initial: false,
  });

  const [, joinCall] = useAxios({
    url: `video-call/join/${matchState?.matchId}`,
    method: 'GET',
    initial: false,
  });

  useEffect(() => {
    const connectToRoom = async (token: string) => {
      if (Platform.OS === 'android') {
        await _requestAudioPermission();
        await _requestCameraPermission();
      }

      if (!twilioVideo.current) {
        return;
      }
      twilioVideo.current.connect({
        accessToken: token,
        enableVideo: true,
        enableAudio: true,
      });
      setStatus('connecting');
    };

    const handleInitiating = async () => {
      if (isCaller && matchState) {
        const { response, error } = await initiateCall();
        if (error || !response.data) {
          console.log('Initiate call API error: ', error?.message);
          return;
        }
        const { data } = response;
        await connectToRoom(data.token);
      }
      if (!isCaller && matchState) {
        const { response, error } = await joinCall();
        if (error || !response.data) {
          console.log('Join call API error: ', error?.message);
          return;
        }
        const { data } = response;
        await connectToRoom(data.token);
      }
      return;
    };
    handleInitiating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'disconnected') {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const sendMessage = async (info: string) => {
    try {
      await channel?.sendMessage(
        {
          text: ' ', // only appears in chat if a text is set
          info,
          isVideoInfoMessage: true,
        },
        {
          skip_push: true,
        },
      );
    } catch (e) {
      console.error('Error sending video info message: ', e);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(id);
    }
    if (timer === 0) {
      sendMessage('missed-call');
      twilioVideo.current?.disconnect();
      setStatus('disconnected');
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    if (buttonTimer === 0) {
      setButtonsVisible(false);
    }
    if (buttonTimer > 0) {
      timeoutRef.current = setTimeout(
        () => setButtonTimer(buttonTimer - 1),
        1000,
      );
    }
    return () => clearTimeout(timeoutRef.current);
  }, [buttonTimer]);

  const resetButtonTimer = () => {
    setButtonsVisible(true);
    setButtonTimer(5);
  };

  const prepareAndPlayCallerRingtone = () => {
    audioPlayer.current.prepare(() => {
      if (isMounted.current) {
        audioPlayer.current.play();
      }
    });
  };

  const verifyAudioModeAndPrepareRingtone = async () => {
    if (Platform.OS === 'android') {
      const ringerMode = await RingerMode.getRingerMode();
      if (ringerMode === 'NORMAL') {
        prepareAndPlayCallerRingtone();
      }
    } else {
      prepareAndPlayCallerRingtone();
    }
  };

  useEffect(() => {
    return () => {
      audioPlayer.current.stop();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioPlayer.current.destroy();
      playSilentAudio();
      isMounted.current = false;
    };
  }, []);

  const _onEndButtonPress = async () => {
    if (isCaller && timer !== -1) {
      await cancelCall();
      sendMessage('missed-call');
    }
    setStatus('disconnected');
    twilioVideo.current?.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioVideo.current
      ?.setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioVideo.current?.flipCamera();
  };

  const _onRoomDidConnect = ({ participants }: any) => {
    setStatus('connected');
    if (isCaller) {
      // invite other user to call
      inviteToCall();
      verifyAudioModeAndPrepareRingtone();
    } else {
      if (!roomParticipant && participants.length > 1) {
        setRoomParticipant(participants[0]);
      }
    }
  };

  const _onRoomDidDisconnect = ({ error }: any) => {
    console.error('DISCONNECTED: ', error);
    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = (error: any) => {
    console.error('FAILED TO CONNECT: ', error);
    setStatus('disconnected');
  };

  const _onRoomParticipantDidConnect = (participant: any) => {
    // stop timer
    setTimer(-1);
    setRoomParticipant(participant);
    audioPlayer.current.stop();
    audioPlayer.current.destroy();
    playSilentAudio();
  };

  const _onRoomParticipantDidDisconnect = () => {
    twilioVideo.current?.disconnect();
    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }: any) =>
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ]),
    );

  const _onParticipantRemovedVideoTrack = ({ track }: TrackEventCbArgs) => {
    const newVideoTracks = new Map(videoTracks);
    newVideoTracks.delete(track.trackSid);
    setVideoTracks(newVideoTracks);
  };

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Need permission to access microphone',
        message:
          'To run this demo we need permission to access your microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To run this demo we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  };

  return {
    status,
    isAudioEnabled,
    roomParticipant,
    videoTracks,
    buttonsVisible,
    resetButtonTimer,
    _onEndButtonPress,
    _onMuteButtonPress,
    _onFlipButtonPress,
    _onRoomDidConnect,
    _onRoomDidDisconnect,
    _onRoomDidFailToConnect,
    _onParticipantAddedVideoTrack,
    _onParticipantRemovedVideoTrack,
    _onRoomParticipantDidConnect,
    _onRoomParticipantDidDisconnect,
  };
};
