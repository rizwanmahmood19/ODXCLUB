import { MatchItem } from '@match-app/shared';
import React, { createContext, useState } from 'react';

export interface MatchItemOptionalFBID
  extends Omit<MatchItem, 'firebaseUserId'> {
  firebaseUserId?: string;
}

export type CatchModalContextState = {
  isCatchModalOpen: boolean;
  openCatchModal: (matchItem: MatchItemOptionalFBID) => void;
  closeCatchModal: () => void;
  matchItem?: MatchItemOptionalFBID;
};

export const CatchModalContext = createContext<CatchModalContextState>({
  isCatchModalOpen: false,
  openCatchModal: () => Promise.resolve(),
  closeCatchModal: () => Promise.resolve(),
});

export const CatchModalProvider: React.FC = ({ children }) => {
  const [isCatchModalOpen, setIsCatchModalOpen] = useState(false);
  const [matchItem, setMatchItem] = useState<MatchItemOptionalFBID>();

  const openCatchModal = (item: MatchItemOptionalFBID) => {
    if (item.name && item.thumbnailUrl) {
      setMatchItem(item);
      setIsCatchModalOpen(true);
    }
  };

  const closeCatchModal = () => {
    setMatchItem(undefined);
    setIsCatchModalOpen(false);
  };

  return (
    <CatchModalContext.Provider
      value={{
        isCatchModalOpen,
        openCatchModal,
        closeCatchModal,
        matchItem,
      }}>
      {children}
    </CatchModalContext.Provider>
  );
};
