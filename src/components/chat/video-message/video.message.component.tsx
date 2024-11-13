import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image, Modal, TouchableOpacity, View } from 'react-native-ui-lib';
import VideoPlayer from 'react-native-video-controls';
import PlayIcon from '../../../../assets/icons/matchapp_ic_play_circle_outline.svg';
import { appColors } from '../../../style/appColors';
import { OrientationLocker, UNLOCK } from 'react-native-orientation-locker';
import { appStyles } from '../../../style/appStyle';
import { useAppState } from '../../../services/app.state';
import { useMessageContext } from 'stream-chat-react-native';

export interface VideoMessageProps {
  videoUrl: string;
  thumbnailUrl?: string;
  hasText?: boolean;
}

const VideoMessage = ({
  videoUrl,
  thumbnailUrl,
  hasText,
}: VideoMessageProps) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { onLongPress } = useMessageContext();
  useAppState({
    onBackground: () => setIsVideoOpen(false),
  });

  if (!videoUrl) {
    return null;
  }

  const messageWithTextStyles = {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  };

  return (
    <>
      <View style={styles.common}>
        <TouchableOpacity
          onPress={() => setIsVideoOpen(true)}
          onLongPress={() => onLongPress({})}>
          <Image
            height={200}
            width={200}
            style={[styles.thumbnail, hasText ? messageWithTextStyles : {}]}
            source={{
              uri: thumbnailUrl,
            }}
          />
          <PlayIcon style={styles.playIconOverlay} height={80} width={80} />
        </TouchableOpacity>
      </View>
      {isVideoOpen && (
        <Modal
          visible={isVideoOpen}
          animationType="fade"
          onRequestClose={() => setIsVideoOpen(false)}
          overlayBackgroundColor="#000000">
          <OrientationLocker orientation={UNLOCK} />
          <VideoPlayer
            onBack={() => setIsVideoOpen(false)}
            source={{ uri: videoUrl }}
            onError={console.error}
            onLoad={() => console.log(`Loading video, ${videoUrl}`)}
            ref={(ref: any) => {
              try {
                // this makes the timer count up by default, not down
                ref._toggleTimer();
              } catch (ignored) {}
            }}
            resizeMode="contain"
            disableVolume
            toggleResizeModeOnFullscreen={false}
            fullscreenAutorotate
            isFullScreen
            controls={false}
            disableFullscreen // this just means an extra icon in the controls, not generally fullscreen
            showTimeRemaining={false}
            onFullscreenPlayerWillDismiss={() => setIsVideoOpen(false)}
            style={styles.video}
          />
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  common: {
    flexDirection: 'row',
  },
  playIconOverlay: {
    left: 60,
    position: 'absolute',
    top: 60,
  },
  sentAudio: {
    backgroundColor: appColors.primary,
    borderBottomRightRadius: 0,
  },
  thumbnail: { backgroundColor: '#000', borderRadius: appStyles.borderRadius },
  video: {
    height: '100%',
    width: '100%',
  },
});

export default VideoMessage;
