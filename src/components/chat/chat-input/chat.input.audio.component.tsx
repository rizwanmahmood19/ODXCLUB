import React, { useContext } from 'react';
import { Hint, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { LongPressGestureHandler } from 'react-native-gesture-handler';
import AudioIconPrimary from '../../../../assets/icons/matchapp_microphone.svg';
import TrashIcon from '../../../../assets/icons/matchapp_ic_trash.svg';
import TrashIconWhite from '../../../../assets/icons/matchapp_ic_trash_white.svg';
import { useChatInputAudioSelector } from './chat.input.audio.selector';
import { appColors } from '../../../style/appColors';
import { appFont } from '../../../style/appFont';
import { LocalizationContext } from '../../../services/LocalizationContext';
import { appStyles } from '../../../style/appStyle';
import { is_android, is_iOS } from '../../../util/osCheck';

const HINT_WIDTH = Dimensions.get('window').width;

export interface ChatInputAudioProps {
  onAudio: (audioFilePath: string, duration: number) => void;
  AudioIcon?: React.FC;
  setIsRecording: (value: boolean) => void;
  isRecording: boolean;
  isSecretMessage?: boolean;
}

const ChatInputAudio = (props: ChatInputAudioProps) => {
  const {
    audioButtonDx,
    animatedScale,
    timer,
    showHint,
    openHint,
    closeHint,
    handleGesture,
    handleLongPress,
  } = useChatInputAudioSelector(props);
  const { l10n } = useContext(LocalizationContext);

  const { AudioIcon = AudioIconPrimary, isSecretMessage, isRecording } = props;

  const recordingStyles = {
    left: audioButtonDx,
  };

  const recordingButtonAnimatedStyles = {
    transform: [{ scale: animatedScale }],
  };

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={
            props.isRecording
              ? [styles.recordingButtonContainer, recordingStyles]
              : styles.recordingButtonContainer
          }>
          {props.isRecording && (
            <Animated.View
              style={[styles.recordingButton, recordingButtonAnimatedStyles]}>
              <AudioIcon width={25} height={25} />
            </Animated.View>
          )}
          <LongPressGestureHandler
            maxDist={300}
            shouldCancelWhenOutside={false}
            onHandlerStateChange={handleLongPress}
            onGestureEvent={handleGesture}>
            <View
              style={
                props.isRecording && is_iOS
                  ? styles.hideStaticRecordingButton
                  : undefined
              }>
              <Hint
                {...(isSecretMessage ? secretMessageStyles.hint : styles.hint)}
                visible={showHint}
                onBackgroundPress={closeHint}
                useSideTip={true}
                edgeMargins={0}
                message={
                  <Text style={styles.hintMessage} onPress={closeHint}>
                    <Text>{l10n.chat.chatInput.audioClick}</Text>
                  </Text>
                }
                containerWidth={HINT_WIDTH}
                position="top">
                <View useSafeArea>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={!isRecording ? openHint : undefined}>
                    <AudioIcon width={25} height={25} />
                  </TouchableOpacity>
                </View>
              </Hint>
            </View>
          </LongPressGestureHandler>
        </Animated.View>
        {props.isRecording && (
          <View style={styles.recordingContainer}>
            <View style={styles.recordingInfoContainer}>
              <Text
                style={
                  isSecretMessage
                    ? [styles.slideText, secretMessageStyles.whiteColor]
                    : styles.slideText
                }>
                {`${l10n.chat.chatInput.audioCancel}`}
              </Text>
              <Text
                style={
                  isSecretMessage
                    ? [styles.arrowText, secretMessageStyles.whiteColor]
                    : styles.arrowText
                }>
                {' > '}
              </Text>
              {isSecretMessage ? (
                <TrashIconWhite
                  style={styles.trashIcon}
                  height={14}
                  width={14}
                />
              ) : (
                <TrashIcon style={styles.trashIcon} height={14} width={14} />
              )}
            </View>
            <View style={styles.durationContainer}>
              <View style={styles.recordCircle} />
              <Text
                style={
                  isSecretMessage
                    ? [styles.duration, secretMessageStyles.whiteColor]
                    : styles.duration
                }>
                {timer || '00:00'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
const secretMessageStyles = StyleSheet.create({
  hint: {
    borderRadius: appStyles.borderRadius,
    color: appColors.third,
    marginLeft: 8,
    marginTop: 4,
    padding: 0,
  },
  whiteColor: {
    color: 'white',
  },
});

const styles = StyleSheet.create({
  arrowText: {
    color: appColors.primary,
    fontFamily: appFont.semiBold,
    fontSize: 14,
    top: is_android ? 1 : -1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  duration: {
    color: appColors.secondary,
    fontFamily: appFont.bold,
  },
  durationContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  hideStaticRecordingButton: {
    opacity: 0,
  },
  hint: {
    borderRadius: appStyles.borderRadius,
    color: appColors.secondary,
    marginLeft: 8,
    marginTop: 4,
    padding: 0,
  },
  hintMessage: {
    fontFamily: appFont.semiBold,
    fontSize: 13,
  },
  recordCircle: {
    alignSelf: 'center',
    backgroundColor: appColors.secondary,
    borderRadius: 100,
    bottom: 1,
    height: 8,
    right: 3,
    top: is_android ? 1 : -1,
    width: 8,
  },
  recordingButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 204, 204, 0.2)',
    borderRadius: 25,
    display: 'flex',
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    width: 50,
    zIndex: 3,
  },
  recordingButtonContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: 20,
    zIndex: is_iOS ? 4 : undefined,
  },
  recordingContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 10,
    paddingVertical: is_iOS ? 8 : 4,
    position: 'absolute',
    top: -4,
  },
  recordingInfoContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginRight: 20,
    zIndex: 1,
  },
  slideText: {
    color: appColors.primary,
    fontFamily: appFont.semiBold,
    fontSize: 14,
    paddingLeft: 30,
  },
  trashIcon: {
    alignSelf: 'center',
  },
});

export default ChatInputAudio;
