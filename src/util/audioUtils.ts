import { Player } from '@react-native-community/audio-toolkit';

export const playStopAndDestroy = (player: Player) => {
  player.play();
  player.stop();
  player.destroy();
};
