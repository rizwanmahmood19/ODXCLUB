import { useContext, useEffect, useRef, useState } from 'react';
import { Player } from '@react-native-community/audio-toolkit';

import { AudioMessageProps } from './audio.message.component';
import { AudioControlContext } from './audio.control.context';
import { useAppState } from '../../../services/app.state';

const audioConfig = { autoDestroy: false, category: 1 };

export const useAudioMessageSelector = (props: AudioMessageProps) => {
  const { audioUrl } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration] = useState<number>(props.duration * 1000);
  const audioPlayer = useRef(new Player(audioUrl, audioConfig));
  const isMounted = useRef(true);
  const { registerPlayer, unRegisterPlayer, stopOtherPlayers } =
    useContext(AudioControlContext);

  useAppState({
    onBackground: () => {
      if (audioPlayer.current.isPlaying) {
        audioPlayer.current.pause();
        setIsPlaying(false);
      }
    },
  });

  useEffect(() => {
    const handleRecordEnd = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audioPlayer.current.on('ended', handleRecordEnd);
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioPlayer.current]);

  useEffect(() => {
    const player = audioPlayer.current;
    registerPlayer({
      player: player as any,
      onStop: () => {
        if (audioPlayer.current.isPlaying) {
          audioPlayer.current.pause();
          setIsPlaying(false);
        }
      },
    });
    return () => {
      unRegisterPlayer(player as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayClick = () => {
    stopOtherPlayers(audioPlayer.current as any);

    const _play = () => {
      audioPlayer.current.play(() => {
        setIsPlaying(true);
        const progressInterval = setInterval(() => {
          if (audioPlayer.current.isPlaying) {
            let currentProgress =
              Math.max(0, audioPlayer.current.currentTime) /
              (audioPlayer.current.duration || 1);
            if (isNaN(currentProgress)) {
              currentProgress = 0;
            }
            if (isMounted) {
              setProgress(currentProgress);
            }
          } else {
            clearInterval(progressInterval);
          }
        }, 30);
      });
    };

    if (audioPlayer.current.canPlay) {
      _play();
    } else if (!audioPlayer.current.isPrepared) {
      audioPlayer.current.prepare(() => {
        _play();
      });
    }
  };

  const handleSeekEnd = () => audioPlayer.current.seek(progress * duration!);

  const handleSliderChange = (position: number) => {
    audioPlayer.current.pause();
    setIsPlaying(false);
    setProgress(position);
  };

  const handlePauseClick = () => {
    audioPlayer.current.pause();
    setIsPlaying(false);
  };

  return {
    isPlaying,
    duration,
    progress,
    handleSeekEnd,
    handleSliderChange,
    handlePlayClick,
    handlePauseClick,
  };
};
