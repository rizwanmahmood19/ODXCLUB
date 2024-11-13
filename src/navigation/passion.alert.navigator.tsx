import React from 'react';

import { AppRoute } from './app.routes';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { PassionAlertScreen } from '../scenes/passion-alert';

export type PassionAlertNavigatorParams = {
  [AppRoute.PASSION_ALERT]: undefined;
};

export interface PassionAlertNavigationProps {
  navigation: StackNavigationProp<
    PassionAlertNavigatorParams,
    AppRoute.PASSION_ALERT
  >;
}

const Stack = createStackNavigator<PassionAlertNavigatorParams>();

export const PassionAlertNavigator = (props: PassionAlertNavigationProps) => {
  const { navigation } = props;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const passionAlertScreen = () => (
    <PassionAlertScreen navigation={{ goBack: handleGoBack }} />
  );

  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={AppRoute.PASSION_ALERT}>
      <Stack.Screen
        name={AppRoute.PASSION_ALERT}
        component={passionAlertScreen}
      />
    </Stack.Navigator>
  );
};
