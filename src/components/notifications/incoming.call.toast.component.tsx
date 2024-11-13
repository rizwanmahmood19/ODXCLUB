import React, { useContext, useEffect, useRef } from 'react';

import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import AcceptCallIcon from '../../../assets/icons/matchapp_ic_video_call.svg';
import EndCallIcon from '../../../assets/icons/matchapp_ic_call_off.svg';
import { Platform, StyleSheet, Vibration } from 'react-native';
import { appFont } from '../../style/appFont';
import { CustomToast } from '../custom/custom.toast.component';
import { IIncomingCallToast } from '../../util/useNotifcations';
import logEvent from '../../analytics/analytics';
import { Player } from '@react-native-community/audio-toolkit';
import RingerMode from 'react-native-ringer-mode';
import {
  UserInteractionEvent,
  VideoCallEvent,
} from '../../analytics/analytics.event';
import { AudioControlContext } from '../chat/audio-messages/audio.control.context';
import { useAppState } from '../../services/app.state';
import { is_iOS } from '../../util/osCheck';
import { playStopAndDestroy } from '../../util/audioUtils';

const ICON_SIZE = 48;
const VIBRATION_PATTERN = [1000, 1000]; // 1s of vibrating, 1s not vibrating

interface IncomingCallToastProps {
  toast: IIncomingCallToast;
  dismissToast: () => void;
}

const IncomingCallToast = (props: IncomingCallToastProps) => {
  const { toast, dismissToast } = props;
  const { stopOtherPlayers } = useContext(AudioControlContext);
  const isMounted = useRef(true);
  const audioPlayer = useRef<Player>(
    new Player('video_call_receiving.wav', {
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

  const playRingtoneAndVibrate = () => {
    audioPlayer.current.prepare(() => {
      if (isMounted.current === true) {
        audioPlayer.current.play();
        Vibration.vibrate(VIBRATION_PATTERN, true);
      }
    });
  };

  const verifyAudioModeAndPrepareRingtone = async () => {
    if (Platform.OS === 'android') {
      const ringerMode = await RingerMode.getRingerMode();
      switch (ringerMode) {
        case 'NORMAL':
          playRingtoneAndVibrate();
          break;
        case 'VIBRATE':
          Vibration.vibrate(VIBRATION_PATTERN, true);
          break;
        default:
          break;
      }
    } else {
      playRingtoneAndVibrate();
    }
  };

  useEffect(() => {
    // stops possible other audio plays
    stopOtherPlayers();

    verifyAudioModeAndPrepareRingtone();

    return () => {
      audioPlayer.current.stop();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioPlayer.current.destroy();
      playSilentAudio();
      Vibration.cancel();
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAppState({
    onChange: (nextAppState) => {
      if (nextAppState !== 'active') {
        Vibration.cancel();
      } else {
        if (isMounted.current) {
          Vibration.vibrate(VIBRATION_PATTERN, true);
        }
      }
    },
  });

  const handleDismissToast = () => {
    audioPlayer.current.stop();
    audioPlayer.current.destroy();
    playSilentAudio();
    Vibration.cancel();
    dismissToast();
  };

  return (
    <CustomToast backgroundColor="rgba(90,90,90,0.85)">
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.5}
          onPress={handleDismissToast}>
          <Text style={styles.closeButtonText}>x</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={[styles.text, styles.smallText]}>
            {toast.message}
          </Text>
          <Text numberOfLines={1} style={[styles.text, styles.bigText]}>
            {toast.description}
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (typeof toast.onReject === 'function') {
                toast.onReject();
              }
              handleDismissToast();
            }}>
            <EndCallIcon width={ICON_SIZE} height={ICON_SIZE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              logEvent(
                UserInteractionEvent.click + '_' + VideoCallEvent.accept,
              );
              if (typeof toast.onAccept === 'function') {
                toast.onAccept();
              }
              handleDismissToast();
            }}>
            <AcceptCallIcon width={ICON_SIZE} height={ICON_SIZE} />
          </TouchableOpacity>
        </View>
      </View>
    </CustomToast>
  );
};

const styles = StyleSheet.create({
  bigText: {
    fontFamily: appFont.extraBold,
    fontSize: 24,
  },
  button: {
    paddingRight: 12,
  },
  buttonsContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    height: 35,
    left: 12,
    top: 10,
    width: 35,
    zIndex: 10,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: appFont.semiBold,
    fontSize: 22,
    lineHeight: 25,
  },
  container: {
    flexDirection: 'row',
    height: 96,
    justifyContent: 'space-between',
  },
  smallText: {
    fontFamily: appFont.medium,
    fontSize: 16,
  },
  text: {
    color: '#ffffff',
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
});

export default IncomingCallToast;
