import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { appColors } from '../../../style/appColors';
import { useAudioMessageSelector } from './audio.message.selector';
import ReceivedPlayIcon from '../../../../assets/icons/matchapp_play_green.svg';
import PlayIconWhite from '../../../../assets/icons/matchapp_play_white.svg';
import PlayIconBlack from '../../../../assets/icons/matchapp_play_black.svg';
import SecretMessagePlayIcon from '../../../../assets/icons/matchapp_play_pink.svg';
import ReceivedPauseIcon from '../../../../assets/icons/matchapp_pause_green.svg';
import PauseIconWhite from '../../../../assets/icons/matchapp_pause_white.svg';
import PauseIconBlack from '../../../../assets/icons/matchapp_pause_black.svg';
import SecretMessagePauseIcon from '../../../../assets/icons/matchapp_pause_pink.svg';
import AudioTrack from './audio.track.component';
import { appFont } from '../../../style/appFont';
import format from 'format-duration';
import { useMessageContext } from 'stream-chat-react-native';
import InfoText from '../../custom/styleguide-components/info.text.component';

export interface AudioMessageProps {
  audioUrl: string;
  isMyMessage: boolean;
  duration: number; // seconds
  isChatSecretMessage?: boolean;
  isDeckSecretMessage?: boolean;
}

function getIcons({
  isMyMessage,
  isDeckSecretMessage,
  isChatSecretMessage,
}: {
  isMyMessage?: boolean;
  isDeckSecretMessage?: boolean;
  isChatSecretMessage?: boolean;
}) {
  if (isDeckSecretMessage) {
    return {
      PauseIcon: SecretMessagePauseIcon,
      PlayIcon: SecretMessagePlayIcon,
    };
  }
  if (isMyMessage) {
    return {
      PauseIcon: PauseIconWhite,
      PlayIcon: PlayIconWhite,
    };
  }
  if (!isMyMessage && isChatSecretMessage) {
    return {
      PauseIcon: PauseIconBlack,
      PlayIcon: PlayIconBlack,
    };
  }
  return {
    PauseIcon: ReceivedPauseIcon,
    PlayIcon: ReceivedPlayIcon,
  };
}

const AudioMessage = (props: AudioMessageProps) => {
  const { isMyMessage, duration, isDeckSecretMessage, isChatSecretMessage } =
    props;
  const {
    isPlaying,
    progress,
    handleSeekEnd,
    handleSliderChange,
    handlePlayClick,
    handlePauseClick,
  } = useAudioMessageSelector(props);
  const { onLongPress } = useMessageContext();
  const { PauseIcon, PlayIcon } = useMemo(
    () => getIcons({ isDeckSecretMessage, isMyMessage, isChatSecretMessage }),
    [isMyMessage, isDeckSecretMessage, isChatSecretMessage],
  );
  return (
    <TouchableOpacity onLongPress={() => onLongPress({})}>
      <View
        style={
          isMyMessage
            ? dynamicStyles(isDeckSecretMessage, isChatSecretMessage).sentAudio
            : dynamicStyles(isDeckSecretMessage, isChatSecretMessage)
                .receivedAudio
        }>
        {isChatSecretMessage && !isDeckSecretMessage && (
          <View>
            <InfoText
              style={[
                styles.title,
                isMyMessage
                  ? dynamicStyles(isDeckSecretMessage, isChatSecretMessage)
                      .titleSent
                  : dynamicStyles(isDeckSecretMessage, isChatSecretMessage)
                      .titleReceived,
              ]}>
              Secret Message!
            </InfoText>
          </View>
        )}
        <View style={styles.common}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={isPlaying ? handlePauseClick : handlePlayClick}>
            {isPlaying ? (
              <PauseIcon height={20} width={20} />
            ) : (
              <PlayIcon height={20} width={20} />
            )}
          </TouchableOpacity>
          <View style={styles.slider}>
            <AudioTrack
              onValueChange={handleSliderChange}
              onSeekEnd={handleSeekEnd}
              color={
                isMyMessage
                  ? dynamicStyles(isDeckSecretMessage, isChatSecretMessage)
                      .durationTextSent.color
                  : dynamicStyles(isDeckSecretMessage, isChatSecretMessage)
                      .durationTextReceived.color
              }
              minimumValue={0}
              maximumValue={1}
              value={progress}
              step={0.00001}
            />
          </View>
          <View style={styles.duration}>
            <Text
              style={
                isMyMessage
                  ? dynamicStyles(isDeckSecretMessage, isChatSecretMessage)
                      .durationTextSent
                  : dynamicStyles(isDeckSecretMessage, isChatSecretMessage)
                      .durationTextReceived
              }>
              {duration ? format(duration * 1000) : ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getColor = (isDeckSM?: boolean, isChatSM?: boolean) => {
  if (isDeckSM) return appColors.secondary;
  return isChatSM ? 'black' : appColors.primary;
};

const getReceivedBgColor = (isDeckSM?: boolean, isChatSM?: boolean) => {
  if (isDeckSM) return 'white';
  return isChatSM ? appColors.secondaryLighter : appColors.primaryLighter;
};

const getSentBgColor = (isDeckSM?: boolean, isChatSM?: boolean) => {
  if (isDeckSM) return 'white';
  return isChatSM ? appColors.secondary : appColors.primary;
};

const dynamicStyles = (
  isDeckSecretMessage?: boolean,
  isChatSecretMessage?: boolean,
) => ({
  durationTextReceived: {
    color: getColor(isDeckSecretMessage, isChatSecretMessage),
    fontFamily: appFont.regular,
  },
  durationTextSent: {
    color: isDeckSecretMessage ? appColors.secondary : '#fff',
    fontFamily: appFont.regular,
  },
  receivedAudio: {
    backgroundColor: getReceivedBgColor(
      isDeckSecretMessage,
      isChatSecretMessage,
    ),
    borderBottomLeftRadius: 0,
  },
  sentAudio: {
    backgroundColor: getSentBgColor(isDeckSecretMessage, isChatSecretMessage),
    borderBottomRightRadius: 0,
  },
  titleReceived: {
    color: isChatSecretMessage ? 'black' : appColors.primary,
  },
  titleSent: {
    color: 'white',
  },
});

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    justifyContent: 'center',
    paddingRight: 10,
  },
  common: {
    borderRadius: 15,
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 14,
  },
  duration: {
    bottom: 5,
    minWidth: 40,
    position: 'absolute',
    right: 10,
    zIndex: 10,
  },
  slider: {
    overflow: 'hidden',
    position: 'relative',
    width: 120,
  },
  title: {
    fontFamily: appFont.bold,
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 12,
    marginTop: 8,
  },
});

export default AudioMessage;
