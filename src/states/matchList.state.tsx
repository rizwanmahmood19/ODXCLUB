import React, { createContext } from 'react';
import { MatchItem } from '@match-app/shared';
import { useAxios } from '../util/useAxios';

type MatchListContextState = {
  matchList: MatchItem[];
  isLoading: boolean;
  fetchNewMatches: () => void;
};

const MatchListContext = createContext<MatchListContextState>({
  matchList: [],
  isLoading: false,
  fetchNewMatches: () => null,
});

const MatchListProvider: React.FC = ({ children }) => {
  const [{ data, loading: isLoading }, fetchNewMatches] = useAxios<MatchItem[]>(
    {
      url: '/matching/matches',
      params: {
        filter: 'new',
      },
      method: 'GET',
      initial: false,
    },
  );

  return (
    <MatchListContext.Provider
      value={{ matchList: data || [], isLoading, fetchNewMatches }}>
      {children}
    </MatchListContext.Provider>
  );
};

export { MatchListProvider, MatchListContext };
