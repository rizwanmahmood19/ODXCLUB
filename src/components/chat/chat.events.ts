import React from 'react';
import { Channel, Event, StreamChat } from 'stream-chat';
import { getChannel } from 'stream-chat-react-native-core/src/components/ChannelList/utils';
import uniqBy from 'lodash/uniqBy';

export const onAddedToChannel =
  (client: StreamChat) =>
  async (
    setChannels: React.Dispatch<React.SetStateAction<Channel[]>>,
    event: Event,
  ) => {
    if (!event.channel?.id || !event.channel?.type) {
      return;
    }
    const channel = await getChannel({
      client,
      id: event.channel.id,
      type: event.channel.type,
    });
    // There are cases where the channel will be hidden directly after a user was added to it.
    if (
      !channel ||
      channel.data?.smOrigin ||
      channel.data?.matchId ||
      channel.data?.secretMessage ||
      channel.data?.readonly
    ) {
      return;
    }
    setChannels((channels) => uniqBy([channel, ...channels], 'cid'));
  };

export const onNewMessage =
  (client: StreamChat) =>
  async (
    setChannels: React.Dispatch<React.SetStateAction<Channel[]>>,
    event: Event,
  ) => {
    if (!event.channel?.id || !event.channel?.type) {
      return;
    }
    const channel = await getChannel({
      client,
      id: event.channel.id,
      type: event.channel.type,
    });
    // There are cases where the channel will be hidden directly after a user receives a message in a channel that is hidden for her/him
    if (!channel || channel.data?.secretMessage) {
      return;
    }
    setChannels((channels) => uniqBy([channel, ...channels], 'cid'));
  };
