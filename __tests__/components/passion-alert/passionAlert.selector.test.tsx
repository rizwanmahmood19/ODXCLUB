import matchesFakeData from '../../../__data__/matches.fake.data';

import {
  usePassionAlertSelector,
  IPassionAlertSelectorParams,
} from '../../../src/components/passion-alert/passion.alert.selector';

import { renderHook, act } from '@testing-library/react-hooks';
import { PassionAlertCandidate } from '@match-app/shared';

jest.mock('../../../src/util/useAxios', () => ({
  useAxios: () => [
    // Passion alert proposals are type-compatible to MatchItem
    {
      data: {
        profiles: matchesFakeData as PassionAlertCandidate[],
        page: 1,
      },
      loading: false,
    },
  ],
}));

describe('PasionAlert selector', () => {
  const selectorParams: IPassionAlertSelectorParams = {
    client: {
      queryChannels: async ({
        hidden,
        matchId,
      }: {
        hidden: boolean;
        matchId: string;
      }) => (hidden ? [{ data: { matchId } }] : []),
    } as any,
    l10n: { passionAlert: { maxAlert: { title: 'title', text: 'text' } } },
  };

  it('should provide a list of unselected matches', () => {
    const { result } = renderHook(() =>
      usePassionAlertSelector(selectorParams),
    );

    expect(result.current.unselectedMatches).toEqual(matchesFakeData);
    expect(result.current.selectedMatchIds).toHaveLength(0);
  });

  it('should add a single match', async () => {
    const { result } = renderHook(() =>
      usePassionAlertSelector(selectorParams),
    );

    await act(async () => await result.current.addMatch(matchesFakeData[0]));
    expect(result.current.unselectedMatches).toHaveLength(
      matchesFakeData.length - 1,
    );
    expect(result.current.selectedMatchIds).toEqual([
      matchesFakeData[0].matchId,
    ]);
  });

  it('should not add the same match twice', async () => {
    const { result } = renderHook(() =>
      usePassionAlertSelector(selectorParams),
    );

    const match = matchesFakeData[0];
    await act(async () => await result.current.addMatch(match));
    await act(async () => await result.current.addMatch(match));

    // Expect it only to be added once
    expect(result.current.unselectedMatches).toHaveLength(
      matchesFakeData.length - 1,
    );
    expect(result.current.selectedMatchIds).toEqual([
      matchesFakeData[0].matchId,
    ]);
  });

  it('should remove a single match', async () => {
    const { result } = renderHook(() =>
      usePassionAlertSelector(selectorParams),
    );

    // Preparation: add first match (as tested above)
    await act(async () => await result.current.addMatch(matchesFakeData[0]));
    // But now remove it again
    act(() => result.current.removeMatch(matchesFakeData[0]));

    expect(result.current.unselectedMatches).toHaveLength(
      matchesFakeData.length,
    );
    expect(result.current.selectedMatchIds).toHaveLength(0);
  });

  it('should not allow adding more than maxSelectedMatches', async () => {
    const maxSelectedMatches = 2;

    const { result } = renderHook(() =>
      usePassionAlertSelector({ ...selectorParams, maxSelectedMatches }),
    );

    for (let i = 0; i < maxSelectedMatches + 1; i++) {
      await act(async () => await result.current.addMatch(matchesFakeData[i]));
    }

    expect(result.current.selectedMatches).toHaveLength(maxSelectedMatches);
  });

  it('should expose the channel that is associated to each selected match', async () => {
    const { result } = renderHook(() =>
      usePassionAlertSelector(selectorParams),
    );

    expect(result.current.channels).toHaveLength(0);

    await act(
      async () =>
        await result.current.addMatch(result.current.unselectedMatches[0]),
    );

    expect(result.current.channels).toEqual([
      { data: { matchId: matchesFakeData[0].matchId } },
    ]);
  });
});
