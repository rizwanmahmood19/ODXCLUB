import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { MaybeTabNavigationProp } from './home.navigator';
import { AppRoute } from './app.routes';
import { MaybeScreen } from '../scenes/maybe';

type MaybeNavigatorParams = {
  [AppRoute.MAYBE]: undefined;
};

export interface MaybeNavigationProps {
  navigation: CompositeNavigationProp<
    MaybeTabNavigationProp,
    StackNavigationProp<MaybeNavigatorParams, AppRoute.MAYBE>
  >;
  route: RouteProp<MaybeNavigatorParams, AppRoute.MAYBE>;
}

const Stack = createStackNavigator<MaybeNavigatorParams>();

export const MaybeNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={AppRoute.MAYBE} component={MaybeScreen} />
    </Stack.Navigator>
  );
};
