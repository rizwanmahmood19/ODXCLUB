import React, { useContext } from 'react';

import { AppRoute } from './app.routes';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { MatchItem } from '@match-app/shared/dist/model/MatchItem';
import { ChatScreen } from '../components/chat/chat.component';
import { InitialRouteContext } from '../states/initialRoute.state';

export type ChatNavigatorParams = {
  [AppRoute.CONVERSATION]: undefined;
  [AppRoute.HOME]: undefined;
  [AppRoute.CHAT]: {
    matchItem?: MatchItem;
    channelId?: string;
    navigateOnGoBack?: boolean;
  };
};

export interface ChatNavigationProps {
  navigation: StackNavigationProp<ChatNavigatorParams, AppRoute.CHAT>;
  route: RouteProp<ChatNavigatorParams, AppRoute.CHAT>;
}

const Stack = createStackNavigator<ChatNavigatorParams>();

export const ChatNavigator = (props: ChatNavigationProps) => {
  const { route, navigation } = props;
  const navigateOnGoBack = route.params.navigateOnGoBack;
  const { setHomeInitialRoute } = useContext(InitialRouteContext);

  const handleGoBack = () => {
    if (navigateOnGoBack) {
      setHomeInitialRoute(AppRoute.CONVERSATION);
      navigation.navigate(AppRoute.HOME);
    } else {
      navigation.goBack();
    }
  };

  const chatScreen = () => (
    <ChatScreen
      matchItem={route.params.matchItem}
      channelId={route.params.channelId}
      goBack={handleGoBack}
    />
  );

  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={AppRoute.CHAT}>
      <Stack.Screen name={AppRoute.CHAT} component={chatScreen} />
    </Stack.Navigator>
  );
};
