import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-ui-lib';
import { appColors } from '../../style/appColors';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appFont } from '../../style/appFont';
import { useVideoCallModalSelector } from './video-call.modal.selector';
import { MatchState } from '../chat/chat.selector';
import { Channel } from 'stream-chat';
import LinearGradient from 'react-native-linear-gradient';
import EndCallIcon from '../../../assets/icons/matchapp_ic_call_off.svg';
import MuteIcon from '../../../assets/icons/matchapp_ic_mute_on.svg';
import UnMuteIcon from '../../../assets/icons/matchapp_ic_mute_off.svg';
import FlipCameraIcon from '../../../assets/icons/matchapp_ic_switch_cam.svg';
import { AudioControlContext } from '../chat/audio-messages/audio.control.context';

const OPTIONS_GRADIENT_HEIGHT = Dimensions.get('window').height * 0.48;
const CENTER_ICON_SIZE = 96;
const SIDE_ICON_SIZE = 72;

export interface VideoCallModalProps {
  isCaller: boolean;
  matchState: MatchState;
  onClose: () => void;
  channel?: Channel;
}

const VideoCallModal = (props: VideoCallModalProps) => {
  const twilioVideo = useRef<TwilioVideo | null>(null);
  const {
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
  } = useVideoCallModalSelector(props, twilioVideo);
  const { isCaller, matchState } = props;

  const { l10n } = useContext(LocalizationContext);
  const { stopOtherPlayers } = useContext(AudioControlContext);

  const [flipCameraDisabled, setFlipCameraDisabled] = useState(false);

  const handleFlipCameraClick = () => {
    setFlipCameraDisabled(true);
    _onFlipButtonPress();
    setTimeout(() => {
      setFlipCameraDisabled(false);
    }, 600);
  };

  useEffect(() => {
    // stops possible other audio plays
    stopOtherPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container} onTouchStart={resetButtonTimer}>
      {isCaller &&
        (status === 'initiating' ||
          status === 'connecting' ||
          (status === 'connected' && !roomParticipant)) && (
          <View style={styles.textContainer}>
            <Text style={[styles.smallText, styles.white]}>
              {l10n.videoCall.calling}
            </Text>
            <Text style={[styles.largeText, styles.white]}>
              {matchState?.otherMemberName}
            </Text>
          </View>
        )}
      {status === 'connected' && roomParticipant && (
        <View style={styles.remoteGrid}>
          {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
            return (
              <TwilioVideoParticipantView
                style={styles.remoteVideo}
                key={trackSid}
                trackIdentifier={trackIdentifier}
              />
            );
          })}
        </View>
      )}
      {buttonsVisible && roomParticipant && (
        <LinearGradient
          colors={[
            'rgba(216,216,216,0)',
            'rgba(225,0,122,0.25)',
            'rgba(0,55,145,0.5)',
            'rgba(30,215,220,0.75)',
          ]}
          style={styles.buttonsGradient}
        />
      )}
      <SafeAreaView style={styles.localVideoView}>
        <TwilioVideoLocalView
          enabled={true}
          style={[
            styles.localVideo,
            roomParticipant ? styles.localSmaller : styles.localBigger,
            buttonsVisible
              ? styles.localWithButtons
              : styles.localWithoutButtons,
          ]}
        />
      </SafeAreaView>
      {buttonsVisible && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            disabled={status !== 'connected' || flipCameraDisabled}
            style={styles.sideButton}
            onPress={handleFlipCameraClick}>
            <FlipCameraIcon height={SIDE_ICON_SIZE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={_onEndButtonPress}>
            <EndCallIcon height={CENTER_ICON_SIZE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sideButton}
            onPress={_onMuteButtonPress}>
            {isAudioEnabled ? (
              <MuteIcon height={SIDE_ICON_SIZE} />
            ) : (
              <UnMuteIcon height={SIDE_ICON_SIZE} />
            )}
          </TouchableOpacity>
        </View>
      )}
      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onRoomParticipantDidConnect={_onRoomParticipantDidConnect}
        onRoomParticipantDidDisconnect={_onRoomParticipantDidDisconnect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    alignItems: 'flex-end',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  buttonsGradient: {
    bottom: 0,
    height: OPTIONS_GRADIENT_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: appColors.mainTextColor,
    flex: 1,
  },
  largeText: {
    fontFamily: appFont.extraBold,
    fontSize: 28,
  },
  localBigger: {
    height: 194,
    width: 109,
  },
  localSmaller: {
    height: 180,
    width: 96,
  },
  localVideo: {
    bottom: 60,
    height: 180,
    right: 12,
    width: 96,
  },
  localVideoView: {
    bottom: 12,
    position: 'absolute',
    right: 12,
  },
  localWithButtons: {
    bottom: 160,
  },
  localWithoutButtons: {
    bottom: 12,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    height: '100%',
    width: '100%',
  },
  sideButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  smallText: {
    fontFamily: appFont.medium,
    fontSize: 16,
  },
  textContainer: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'space-evenly',
    paddingTop: 24,
    textDecorationColor: 'white',
    width: '100%',
  },
  white: {
    color: '#ffffff',
  },
});

export default VideoCallModal;
