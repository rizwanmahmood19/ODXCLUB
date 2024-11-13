import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { Channel } from 'stream-chat';

import { ConversationTabNavigationProp } from './home.navigator';
import { AppRoute } from './app.routes';
import { ConversationScreen } from '../scenes/conversation';
import { MatchItem } from '@match-app/shared/dist/model/MatchItem';

type ConversationNavigatorParams = {
  [AppRoute.CONVERSATION]: undefined;
  [AppRoute.CHAT]: {
    matchItem?: MatchItem;
    channelId?: string;
  };
  [AppRoute.PASSION_ALERT]: undefined;
};

export interface ConversationNavigatorProps {
  navigation: CompositeNavigationProp<
    ConversationTabNavigationProp,
    StackNavigationProp<ConversationNavigatorParams, AppRoute.CONVERSATION>
  >;
  route: RouteProp<ConversationNavigatorParams, AppRoute.CONVERSATION>;
}

const Stack = createStackNavigator<ConversationNavigatorParams>();

export const ConversationNavigator = (props: ConversationNavigatorProps) => {
  const { navigation } = props;

  const handleOpenChat = (matchItem: MatchItem) => {
    navigation.navigate(AppRoute.CHAT, {
      matchItem: matchItem,
    });
  };

  const handleChatForChannel = (channel: Channel) => {
    navigation.navigate(AppRoute.CHAT, {
      channelId: channel.id,
    });
  };

  const handleOpenPassionAlert = () =>
    navigation.navigate(AppRoute.PASSION_ALERT);

  const conversationScreen = () => {
    return (
      <ConversationScreen
        navigation={{
          openChat: handleOpenChat,
          openChatForChannel: handleChatForChannel,
          openPassionAlert: handleOpenPassionAlert,
        }}
      />
    );
  };

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name={AppRoute.CONVERSATION}
        component={conversationScreen}
      />
    </Stack.Navigator>
  );
};
