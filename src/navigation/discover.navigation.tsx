import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { DiscoverTabNavigationProp } from './home.navigator';
import { AppRoute } from './app.routes';
import { DiscoverScreen } from '../scenes/discover';

type DiscoverNavigatorParams = {
  [AppRoute.DISCOVER]: undefined;
};

export interface DiscoverNavigationProps {
  navigation: CompositeNavigationProp<
    DiscoverTabNavigationProp,
    StackNavigationProp<DiscoverNavigatorParams, AppRoute.DISCOVER>
  >;
  route: RouteProp<DiscoverNavigatorParams, AppRoute.DISCOVER>;
}

const Stack = createStackNavigator<DiscoverNavigatorParams>();

export const DiscoverNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={AppRoute.DISCOVER} component={DiscoverScreen} />
    </Stack.Navigator>
  );
};
