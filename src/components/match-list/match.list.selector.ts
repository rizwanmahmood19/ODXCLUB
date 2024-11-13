import { useFocusEffect } from '@react-navigation/core';
import { useCallback } from 'react';
import { useAxios } from '../../util/useAxios';

export const useMatchListSelector = () => {
  const [{ data, loading }, fetchNewMatches] = useAxios({
    url: '/matching/matches',
    params: {
      filter: 'new',
    },
    method: 'GET',
    initial: false,
  });

  const onFocus = async () => {
    await fetchNewMatches();
  };

  useFocusEffect(
    useCallback(() => {
      onFocus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return { data, loading };
};
