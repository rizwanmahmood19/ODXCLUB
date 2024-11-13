import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import { Circle, G, Rect, Svg } from 'react-native-svg';
import CancelIcon from '../../../../assets/icons/matchapp_remove_white.svg';
import { LocalizationContext } from '../../../services/LocalizationContext';
import Headline from '../../custom/styleguide-components/headline.component';
import { setIdleTimerDisabled } from 'react-native-idle-timer';
import { is_iOS } from '../../../util/osCheck';

type RecordingCameraProps = {
  onVideo: (filePath: string) => void;
  onCancel: () => void;
};

const MAX_VIDEO_DURATION = 120;

export const RecordingCamera: React.FC<RecordingCameraProps> = ({
  onVideo,
  onCancel,
}) => {
  const cameraRef = useRef<RNCamera | null>(null);
  const { l10n } = useContext(LocalizationContext);
  const [isRecording, setIsRecording] = useState(false);
  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const interval = useRef<undefined | any>();

  useEffect(() => {
    if (isRecording) {
      setIdleTimerDisabled(true);
    }
    return () => setIdleTimerDisabled(false);
  }, [isRecording]);

  const handleButtonPress = async () => {
    if (cameraRef.current) {
      if (isRecording) {
        cameraRef.current.stopRecording();
        return;
      }
      try {
        setIsRecording(true);
        const { uri } = await cameraRef.current.recordAsync({
          maxDuration: MAX_VIDEO_DURATION,
          quality: RNCamera.Constants.VideoQuality['480p'],
          fps: 30,
        });
        if (interval.current !== undefined) {
          clearInterval(interval.current);
        }
        setIsRecording(false);
        onVideo(uri.replace('file:///', ''));
      } catch (e) {
        console.error(e);
      }
    }
  };
  const percent = (secondsRecorded / MAX_VIDEO_DURATION) * 100;
  const dashArray = (percent * (2 * 32 * Math.PI)) / 100;
  return (
    <Modal>
      <RNCamera
        ref={(ref: any) => (cameraRef.current = ref)}
        type={RNCamera.Constants.Type.front}
        style={styles.rnCamera}
        defaultVideoQuality={RNCamera.Constants.VideoQuality['720p']}
        flashMode={RNCamera.Constants.FlashMode.auto}
        onRecordingStart={() => {
          interval.current = setInterval(() => {
            setSecondsRecorded((x) => {
              const update = x + 1;
              if (update > MAX_VIDEO_DURATION + 1 && cameraRef.current) {
                cameraRef.current.stopRecording();
                return 0;
              }
              return update;
            });
          }, 1000);
        }}
      />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          {!isRecording && (
            <>
              <Headline style={styles.title} type="h3">
                {l10n.conversation.video.record}
              </Headline>
              <CancelIcon onPress={onCancel} height={26} width={26} />
            </>
          )}
        </View>
        <TouchableOpacity
          onPress={handleButtonPress}
          style={styles.recordButton}>
          <Svg width="72" height="72" viewBox="0 0 72 72">
            <G>
              {isRecording ? (
                <>
                  <Rect fill="#e1007a" x="20" y="20" width="32" height="32" />
                  <Circle
                    stroke="#FFFFFF"
                    fill="none"
                    strokeWidth="6"
                    cx="36"
                    cy="36"
                    r="32"
                  />
                  <Circle
                    rotation="270"
                    origin="36, 36"
                    stroke="#e1007a"
                    fill="none"
                    strokeWidth="6"
                    strokeDasharray={`${dashArray} 999`}
                    cx="36"
                    cy="36"
                    r="32"
                  />
                </>
              ) : (
                <>
                  <Circle fill="#FFFFFF" cx="36" cy="36" r="24" />
                  <Circle
                    stroke="#FFFFFF"
                    fill="none"
                    strokeWidth="6"
                    cx="36"
                    cy="36"
                    r="32"
                  />
                </>
              )}
            </G>
          </Svg>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: is_iOS ? 18 : undefined,
    paddingTop: is_iOS ? 21 : undefined,
  },
  overlay: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
    paddingBottom: 60,
    paddingHorizontal: 18,
    paddingTop: 21,
    position: 'absolute',
    width: '100%',
  },
  recordButton: {
    alignSelf: 'center',
    paddingBottom: is_iOS ? 60 : undefined,
  },
  rnCamera: {
    height: '100%',
    width: '100%',
  },
  title: {
    color: '#fff',
  },
});
