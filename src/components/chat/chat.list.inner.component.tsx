import React, { useContext, useEffect } from 'react';
import { ChannelListMessenger } from 'stream-chat-react-native';
import { ChatContext } from '../../states/chat.state';
import { useChannelsContext } from 'stream-chat-react-native-core';

/**
 * Is used in List={ChatListInner} by the ChannelList.
 * In this component we can use the ChannelsContext which contains a function to refresh the chat list.
 * We register this function here in the global ChatContext.
 * This way we can reload the chat list from everywhere in the app.
 */
export const ChatListInner = (props: any) => {
  const { refreshList } = useChannelsContext();
  const { registerRefresh } = useContext(ChatContext);
  useEffect(() => {
    registerRefresh(refreshList);
  }, [refreshList, registerRefresh]);

  return <ChannelListMessenger {...props} />;
};
