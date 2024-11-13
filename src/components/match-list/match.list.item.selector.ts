import { useAxios } from '../../util/useAxios';
import { MatchItem } from '@match-app/shared/dist/model/MatchItem';

export const useMatchListItemSelector = () => {
  const [, postOnMatchItem] = useAxios({
    method: 'POST',
    initial: false,
  });

  const onClick = async (matchId: MatchItem['matchId']) => {
    await postOnMatchItem({
      url: `matching/matches/${matchId}/clicked-on`,
      data: {},
    });
  };

  const onFirstMessage = async (matchId: MatchItem['matchId']) => {
    await postOnMatchItem({
      url: `matching/matches/${matchId}/first-message`,
      data: {},
    });
  };

  return { onClick, onFirstMessage };
};
