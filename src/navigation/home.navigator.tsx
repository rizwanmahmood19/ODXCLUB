import React, { useContext } from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationProp,
} from '@react-navigation/material-top-tabs';

import { AppRoute } from './app.routes';
import { ConversationNavigator } from './conversation.navigator';
import { DiscoverNavigator } from './discover.navigation';
import { MaybeNavigator } from './maybe.navigator';
import { ProfileNavigator } from './profile.navigator';
import { HomeTabBar } from '../scenes/home';
import useHomeSelector from '../scenes/home/home.selector';
import { InitialRouteContext } from '../states/initialRoute.state';

export type HomeTapTabsNavigatorParams = {
  [AppRoute.CONVERSATION]: undefined;
  [AppRoute.DISCOVER]: undefined;
  [AppRoute.MAYBE]: undefined;
  [AppRoute.PROFILE]: undefined;
};

export type ConversationTabNavigationProp = MaterialTopTabNavigationProp<
  HomeTapTabsNavigatorParams,
  AppRoute.CONVERSATION
>;
export type DiscoverTabNavigationProp = MaterialTopTabNavigationProp<
  HomeTapTabsNavigatorParams,
  AppRoute.DISCOVER
>;
export type MaybeTabNavigationProp = MaterialTopTabNavigationProp<
  HomeTapTabsNavigatorParams,
  AppRoute.MAYBE
>;
export type ProfileTabNavigationProp = MaterialTopTabNavigationProp<
  HomeTapTabsNavigatorParams,
  AppRoute.PROFILE
>;

const TabBar = createMaterialTopTabNavigator<HomeTapTabsNavigatorParams>();

export const HomeNavigator = (): React.ReactElement => {
  const { homeInitialRoute } = useContext(InitialRouteContext);
  useHomeSelector();

  return (
    <>
      <TabBar.Navigator
        tabBar={HomeTabBar}
        initialRouteName={homeInitialRoute}
        swipeEnabled={false}>
        <TabBar.Screen name={AppRoute.DISCOVER} component={DiscoverNavigator} />
        <TabBar.Screen
          name={AppRoute.CONVERSATION}
          component={ConversationNavigator}
        />
        <TabBar.Screen name={AppRoute.MAYBE} component={MaybeNavigator} />
        <TabBar.Screen name={AppRoute.PROFILE} component={ProfileNavigator} />
      </TabBar.Navigator>
    </>
  );
};
