import { useState } from 'react';
import {
  PassionAlertCandidate,
  PassionAlertCandidateList,
} from '@match-app/shared';
import { useAxios } from '../../util/useAxios';
import { Channel, StreamChat } from 'stream-chat';
import { Alert } from 'react-native';

export const DEFAULT_MAX_SELECTED_MATCHES = 12;

export interface IPassionAlertSelectorParams {
  l10n: any;
  client: StreamChat;
  maxSelectedMatches?: number;
}

export const usePassionAlertSelector = (
  params: IPassionAlertSelectorParams,
) => {
  const [selectedMatches, setSelectedMatches] = useState<
    PassionAlertCandidate[]
  >([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const selectedMatchIds = selectedMatches.map((match) => match.matchId);

  const { l10n, client } = params;
  const maxSelectedMatches =
    params.maxSelectedMatches || DEFAULT_MAX_SELECTED_MATCHES;

  const [{ loading, error, data }] = useAxios<PassionAlertCandidateList>({
    url: '/passion-alert/candidates',
    method: 'GET',
    initial: true,
  });

  const addMatch = async (match: PassionAlertCandidate) => {
    if (selectedMatches.length < maxSelectedMatches) {
      await addChannel(match.matchId);
      if (selectedMatches.some((e) => e.matchId === match.matchId)) {
        return;
      }
      setSelectedMatches([...selectedMatches, match]);
    } else {
      Alert.alert(
        l10n.passionAlert.maxAlert.title,
        l10n.passionAlert.maxAlert.text,
        [{ text: 'OK' }],
        { cancelable: false },
      );
    }
  };

  const addChannel = async (matchId: string) => {
    const query = (hidden: boolean) =>
      client.queryChannels(
        {
          type: 'messaging',
          matchId,
          hidden,
        },
        {},
        {},
      );
    const queriedChannels = [...(await query(true)), ...(await query(false))];
    const newChannels = queriedChannels.filter(
      (c) =>
        !channels.some(
          (existingChannel) =>
            existingChannel.data?.matchId === c.data?.matchId,
        ),
    );
    setChannels((previousChannelList) => [
      ...previousChannelList,
      ...newChannels,
    ]);
  };

  const removeMatch = (match: PassionAlertCandidate) => {
    removeChannel(match.matchId);
    setSelectedMatches([
      ...selectedMatches.filter((m) => m.matchId !== match.matchId),
    ]);
  };

  const removeChannel = (matchId: string) => {
    setChannels((previousChannelList) =>
      previousChannelList.filter(
        (channel) => channel.data!.matchId !== matchId,
      ),
    );
  };

  return {
    unselectedMatches: (data?.profiles || []).filter(
      (match) => selectedMatchIds.indexOf(match.matchId) === -1,
    ),
    selectedMatchIds,
    channels,
    selectedMatches,
    loading,
    error,
    addMatch,
    removeMatch,
  };
};
