import React, { createContext } from 'react';
import { MaybeList } from '@match-app/shared';
import { useAxios } from '../util/useAxios';

type MaybeListContextState = {
  maybeList: MaybeList;
  isLoading: boolean;
  hasMaybeWithSecretMessage: boolean;
  fetchMaybeList: () => void;
};

const MaybeListContext = createContext<MaybeListContextState>({
  maybeList: [],
  isLoading: false,
  hasMaybeWithSecretMessage: false,
  fetchMaybeList: () => null,
});

const MaybeListProvider: React.FC = ({ children }) => {
  const [{ data, loading: isLoading }, fetchMaybeList] = useAxios<MaybeList>({
    url: '/maybe-entries',
    method: 'GET',
    initial: false,
  });

  return (
    <MaybeListContext.Provider
      value={{
        maybeList: data || [],
        isLoading,
        hasMaybeWithSecretMessage: data
          ? data.filter((maybeEntry) => maybeEntry.secretMessageChannelId)
              .length > 0
          : false,
        fetchMaybeList,
      }}>
      {children}
    </MaybeListContext.Provider>
  );
};

export { MaybeListProvider, MaybeListContext };
