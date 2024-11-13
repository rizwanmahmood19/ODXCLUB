import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  LongPressGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import {
  Player,
  PlayerError,
  Recorder,
  RecorderError,
} from '@react-native-community/audio-toolkit';
import moment, { Moment } from 'moment';
import { ChatInputAudioProps } from './chat.input.audio.component';

import { RESULTS } from 'react-native-permissions';
import {
  checkPermission,
  requestPermission,
} from '../../../services/permission/recording.permission';
import { is_android } from '../../../util/osCheck';
import { removeFile } from '../../../util/removeFile'; // Max audio duration in seconds
import { useAppState } from '../../../services/app.state';

// Max audio duration in seconds
const MAX_AUDIO_DURATION = 5 * 60;

export const useChatInputAudioSelector = ({
  onAudio,
  isRecording,
  setIsRecording,
}: ChatInputAudioProps) => {
  const [initialX, setInitialX] = useState<number>();
  const [initialTimer, setInitialTimer] = useState<Moment>();
  const [timer, setTimer] = useState<Moment>();
  const [isDisabled, setIsDisabled] = useState<boolean>();
  // FIXME: use useRef which should prevents unwanted re-renders
  const [recorder, setRecorder] = useState<Recorder>();
  const [permission, setPermission] = useState<string>();
  const [showHint, setShowHint] = useState(false);

  const animatedScale = useRef(new Animated.Value(1)).current;
  const audioButtonDx = useRef(new Animated.Value(0)).current;

  const openHint = async () => {
    if (permission === RESULTS.DENIED) {
      setPermission(await requestPermission());
      return;
    }
    setShowHint(true);
  };
  const closeHint = () => setShowHint(false);

  useEffect(() => {
    const handleRecorder = async () => {
      if (recorder) {
        await startRecording(recorder);
        startTimer();
      } else {
        handleReset();
      }
    };

    handleRecorder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder]);

  useEffect(() => {
    const handleRecording = async () => {
      if (isRecording) {
        setRecorder(
          new Recorder(`${moment()}.mp4`, {
            format: 'aac',
            encoder: 'aac',
          } as any),
        ); // lib typings are wrong
      } else {
        if (!recorder) {
          return;
        }

        try {
          const audioData = await stopRecording(recorder);
          onAudio(audioData.filePath, audioData.duration);
        } catch (e) {}
        setRecorder(undefined);
      }
    };

    handleRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  const startRecording = async (recorderToStart: Recorder) => {
    return new Promise((resolve, reject) => {
      const callback = (error: RecorderError | null) => {
        if (error) {
          removeFile(recorderToStart.fsPath);
          recorderToStart.destroy();
          reject();
        } else {
          resolve(undefined);
        }
      };
      recorderToStart.record(callback);
    });
  };

  const handlePrepareError = (
    player: Player,
    playerError: PlayerError | null,
    recorderToStop: Recorder,
    resolve: (value: { filePath: string; duration: number }) => void,
    reject: (error: PlayerError | null) => void,
  ) => {
    if (playerError || player.duration <= 0 || !player.duration) {
      reject(playerError);
    }
    resolve({
      filePath: recorderToStop.fsPath,
      duration: Math.round(player.duration / 1000),
    });
  };

  const stopRecording = async (
    recorderToStop: Recorder,
  ): Promise<{ filePath: string; duration: number }> => {
    return new Promise((resolve, reject) => {
      const callback = (error: RecorderError | null) => {
        if (error || (audioButtonDx as any).__getValue() > 100) {
          removeFile(recorderToStop.fsPath);
          reject();
          return;
        }
        if (is_android) {
          const player = new Player(recorderToStop.fsPath);
          player.prepare((playerError) => {
            handlePrepareError(
              player,
              playerError,
              recorderToStop,
              resolve,
              reject,
            );
          });
        } else {
          const player = new Player((recorderToStop as any)._path);
          player.play((playerError) => {
            handlePrepareError(
              player,
              playerError,
              recorderToStop,
              resolve,
              reject,
            );
            player.stop();
          });
        }
      };
      recorderToStop.stop(callback);
    });
  };

  useEffect(() => {
    const checkPermissionForRecording = async () => {
      setPermission(await checkPermission());
    };

    checkPermissionForRecording();
  }, []);

  useEffect(() => {
    setIsDisabled(permission !== RESULTS.GRANTED);
  }, [permission]);

  useAppState({
    onBackground: () => {
      if (isRecording) {
        setIsRecording(false);
      }
    },
  });

  const handleReset = () => {
    setInitialX(undefined);
    setTimer(undefined);
    setInitialTimer(undefined);
    audioButtonDx.setValue(0);
  };

  const startTimer = () => {
    const audioStart = moment();
    setInitialTimer(audioStart);
    const timerInterval = setInterval(() => {
      if (recorder && recorder.isRecording) {
        const duration = moment.duration(moment().diff(audioStart)).seconds();
        if (duration > MAX_AUDIO_DURATION) {
          setIsRecording(false);
          clearInterval(timerInterval);
        }
        setTimer(moment());
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
  };

  const handleGesture = ({
    nativeEvent,
  }: LongPressGestureHandlerGestureEvent) => {
    const diffX = nativeEvent.absoluteX - initialX!;
    if (!isNaN(diffX) && diffX > 0 && diffX < 120) {
      audioButtonDx.setValue(diffX);
    }
    if (diffX >= 120) {
      setIsRecording(false);
    }
    sizeAnimation.start();
  };

  const handleLongPress = async ({
    nativeEvent,
  }: LongPressGestureHandlerGestureEvent) => {
    setPermission(await checkPermission());

    if (permission === RESULTS.DENIED) {
      setPermission(await requestPermission());
      return;
    }

    if (permission !== RESULTS.GRANTED) {
      return;
    }

    switch (nativeEvent.state) {
      case State.ACTIVE:
        setInitialX(nativeEvent.absoluteX);
        setIsRecording(true);
        break;
      case State.END:
        if (isRecording) {
          setIsRecording(false);
        }
        break;
      case State.FAILED:
      case State.UNDETERMINED:
      case State.CANCELLED:
        break;
    }
  };

  const sizeAnimation = Animated.loop(
    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 1.3,
        useNativeDriver: true,
        duration: 500,
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
      }),
    ]),
  );

  useEffect(() => {
    isRecording ? sizeAnimation.start() : sizeAnimation.stop();
  }, [isRecording, sizeAnimation]);

  return {
    isDisabled,
    timer: timer
      ? moment
          .utc(
            moment.duration(timer?.diff(initialTimer), 'seconds').asSeconds(),
          )
          .format('mm:ss')
      : '00:00',
    audioButtonDx,
    isRecording,
    animatedScale,
    showHint,
    openHint,
    closeHint,
    handleLongPress,
    handleGesture,
  };
};
