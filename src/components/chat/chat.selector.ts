import { Channel } from 'stream-chat';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../states/chat.state';
import { useMatchListItemSelector } from '../match-list/match.list.item.selector';
import { AuthContext } from '../../states/auth.state';
import * as Sentry from '@sentry/react-native';
import { ChatScreenProps } from './chat.component';

export type MatchState = {
  matchId?: string;
  otherMemberName?: string;
  otherMemberFirebaseId?: string;
  otherMemberThumbnailUrl?: string;
} | null;

export const useChatSelector = ({ channelId, matchItem }: ChatScreenProps) => {
  const {
    client,
    error,
    isLoading,
    isVideoModalOpen,
    openVideoModal,
    closeVideoModal,
    isCaller,
  } = useContext(ChatContext);

  const queryChannel = (options: Record<string, unknown>) =>
    client.queryChannels(
      {
        type: 'messaging',
        ...options,
      },
      {},
      { watch: true, state: true },
    );

  const { state } = useContext(AuthContext);
  const [channelError, setChannelError] = useState<Error | undefined>();
  const [isChannelLoading, setIsChannelLoading] = useState(true);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [matchState, setMatchState] = useState<MatchState>(null);
  const onChannelAvailable = (availableChannel: Channel) => {
    const matchId = matchItem
      ? matchItem.matchId
      : (availableChannel.data?.matchId as string | undefined);
    const otherMemberName = matchItem
      ? matchItem.name
      : getOtherMemberName(availableChannel, state.user?.uid) || 'Unnamed user';
    const otherMemberFirebaseId =
      matchItem && matchItem.firebaseUserId
        ? matchItem.firebaseUserId
        : Object.keys(availableChannel.state.members || {}).find(
            (x) => x !== state.user?.uid,
          );
    const otherMemberThumbnailUrl = matchItem
      ? matchItem.thumbnailUrl
      : (availableChannel.state.members[otherMemberFirebaseId || '']?.user
          ?.image as string | undefined);
    setChannel(availableChannel);
    setMatchState({
      matchId,
      otherMemberName,
      otherMemberFirebaseId,
      otherMemberThumbnailUrl,
    });
    setIsChannelLoading(false);
  };

  useEffect(() => {
    setIsChannelLoading(true);
    if (channelId) {
      Promise.all([
        queryChannel({ id: channelId, hidden: true }),
        queryChannel({ id: channelId }),
      ])
        .then(([hiddenChannels, visibleChannels]) => {
          const channels = [...hiddenChannels, ...visibleChannels];
          if (channels.length) {
            onChannelAvailable(channels[0]);
          } else {
            setChannelError(new Error(`No such channel with ID ${channelId}`));
          }
        })
        .catch((e) => {
          setChannelError(e);
        });
      setChannelError(undefined);
      return;
    }
    if (!matchItem || !matchItem.matchId) {
      setChannelError(new Error('Neither MatchItem nor ChannelId available.'));
      Sentry.captureException(channelError);
      return;
    }
    Promise.all([
      queryChannel({ matchId: matchItem.matchId, hidden: true }),
      queryChannel({ matchId: matchItem.matchId }),
    ])
      .then(([hiddenChannels, visibleChannels]) => {
        const channels = [...hiddenChannels, ...visibleChannels];
        if (channels.length) {
          onChannelAvailable(channels[0]);
          setChannelError(undefined);
        } else {
          setChannelError(
            new Error(
              `Could not find channel for matchItem ${matchItem.matchId}`,
            ),
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setChannelError(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchItem, channelId]);

  const { onClick } = useMatchListItemSelector();

  useEffect(() => {
    if (matchItem && state?.user?.uid && !matchItem.isClickedOn) {
      // inform external for isClicked state change
      onClick(matchItem.matchId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading: isLoading || isChannelLoading,
    client,
    error: error || channelError,
    matchState,
    channel,
    isVideoModalOpen,
    openVideoModal,
    closeVideoModal,
    isCaller,
  };
};

const getOtherMemberName = (
  channel: Channel,
  ownMemberId?: string,
): string | undefined => {
  if (!channel || !ownMemberId) {
    return undefined;
  }

  const members = channel.state ? Object.values(channel.state.members) : [];
  const otherMembers = members.filter(
    ({ user }) => !user || user.id !== ownMemberId,
  );
  return otherMembers
    .map(
      ({ user }) => (user ? user.name || user.id : undefined) || 'Unnamed User',
    )
    .join(', ');
};
