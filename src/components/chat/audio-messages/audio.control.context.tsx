import React, { createContext, useRef } from 'react';
import { Player } from '@react-native-community/audio-toolkit';

type PlayerWithId = Player & { _playerId: number };
type PlayerEntry = {
  player: PlayerWithId;
  onStop: () => void;
};

interface AudioControlProps {
  registerPlayer: (playerEntry: PlayerEntry) => void;
  unRegisterPlayer: (player: PlayerWithId) => void;
  stopOtherPlayers: (player?: PlayerWithId) => void;
}

const AudioControlContext = createContext<AudioControlProps>({
  registerPlayer: () => undefined,
  unRegisterPlayer: () => undefined,
  stopOtherPlayers: () => undefined,
});

const AudioControlProvider: React.FC = ({ children }) => {
  const playerEntries = useRef<Array<PlayerEntry>>([]);
  const registerPlayer = (playerEntry: PlayerEntry) => {
    playerEntries.current.push(playerEntry);
  };
  const unRegisterPlayer = (player: PlayerWithId) => {
    player.destroy();
    playerEntries.current = playerEntries.current.filter(
      (entry) => entry.player._playerId !== player._playerId,
    );
  };
  const stopOtherPlayers = (player?: PlayerWithId) => {
    playerEntries.current.forEach((entry) => {
      const isOtherPlayer = player
        ? entry.player._playerId !== player?._playerId
        : true;
      if (isOtherPlayer) {
        entry.onStop();
      }
    });
  };
  return (
    <AudioControlContext.Provider
      value={{
        registerPlayer,
        unRegisterPlayer,
        stopOtherPlayers,
      }}>
      {children}
    </AudioControlContext.Provider>
  );
};

export { AudioControlContext, AudioControlProvider };
