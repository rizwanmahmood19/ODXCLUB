import React from 'react';

import { AppRoute } from './app.routes';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { ProfileTabNavigationProp } from './home.navigator';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { ProfileSettingsScreen } from '../scenes/profile';
import { AppNavigatorParams } from './app.navigator';
import { currentUser } from '../services/authentication';

type ProfileSettingsNavigatorParams = AppNavigatorParams & {
  [AppRoute.PROFILE_SETTINGS]: undefined;
};

export interface ProfileSettingsNavigationProps {
  navigation: CompositeNavigationProp<
    ProfileTabNavigationProp,
    StackNavigationProp<
      ProfileSettingsNavigatorParams,
      AppRoute.PROFILE_SETTINGS
    >
  >;
  route: RouteProp<ProfileSettingsNavigatorParams, AppRoute.PROFILE_SETTINGS>;
}

const Stack = createStackNavigator<ProfileSettingsNavigatorParams>();

export const ProfileSettingsNavigator = (
  props: ProfileSettingsNavigationProps,
) => {
  const { navigation } = props;
  const profileSettingsScreen = () => {
    const handleOnDonePress = () => {
      navigation.goBack();
    };

    const handleOnChangeCredential = (email: boolean) => {
      const user = currentUser();

      if (!user) {
        return;
      }

      navigation.navigate(AppRoute.CHANGE_CREDENTIAL, {
        screen: email
          ? AppRoute.CHANGE_CREDENTIAL_MAIL
          : AppRoute.CHANGE_CREDENTIAL_PHONE_NUMBER,
        params: { addBehaviour: email ? !user.email : !user.phoneNumber },
      });
    };

    return (
      <ProfileSettingsScreen
        navigation={{
          onDonePress: handleOnDonePress,
          onChangeCredential: handleOnChangeCredential,
        }}
      />
    );
  };

  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={AppRoute.PROFILE_SETTINGS}>
      <Stack.Screen
        name={AppRoute.PROFILE_SETTINGS}
        component={profileSettingsScreen}
      />
    </Stack.Navigator>
  );
};
