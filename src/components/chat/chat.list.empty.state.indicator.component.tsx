import React from 'react';
import ChatListNoChannels from './chat.list.no.channels.component';
import { EmptyStateProps } from 'stream-chat-react-native-core/src/components/Indicators/EmptyStateIndicator';

const ChannelListEmptyStateIndicator = ({ listType }: EmptyStateProps) => {
  switch (listType) {
    case 'channel':
      return <ChatListNoChannels />;
    case 'message':
      return null;
    default:
      return null;
  }
};

export default ChannelListEmptyStateIndicator;
