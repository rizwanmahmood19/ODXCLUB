import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { ProfileTabNavigationProp } from './home.navigator';
import { AppRoute } from './app.routes';
import { ProfileScreen } from '../scenes/profile';
import logEvent from '../analytics/analytics';
import {
  ScreenEvent,
  UserInteractionEvent,
} from '../analytics/analytics.event';

type ProfileNavigatorParams = {
  [AppRoute.PROFILE]: undefined;
  [AppRoute.PROFILE_EDIT]: { showPreview: boolean };
  [AppRoute.PROFILE_EDIT_PHOTOS]: undefined;
  [AppRoute.PROFILE_SETTINGS]: undefined;
};

export interface ProfileNavigationProps {
  navigation: CompositeNavigationProp<
    ProfileTabNavigationProp,
    StackNavigationProp<ProfileNavigatorParams, AppRoute.PROFILE>
  >;
  route: RouteProp<ProfileNavigatorParams, AppRoute.PROFILE>;
}

const Stack = createStackNavigator<ProfileNavigatorParams>();

export const ProfileNavigator = (props: ProfileNavigationProps) => {
  const { navigation } = props;

  const handleSettingsOnPress = () => {
    logEvent(UserInteractionEvent.click + '_' + ScreenEvent.settings);
    navigation.navigate(AppRoute.PROFILE_SETTINGS);
  };

  const handleProfilePreviewOnPress = () => {
    navigation.navigate(AppRoute.PROFILE_EDIT, { showPreview: true });
  };

  const handleProfileEditOnPress = () => {
    navigation.navigate(AppRoute.PROFILE_EDIT, { showPreview: false });
  };

  const profileScreen = () => {
    return (
      <ProfileScreen
        navigation={{
          onSettingsPress: handleSettingsOnPress,
          onProfilePreviewPress: handleProfilePreviewOnPress,
          onProfileEditPress: handleProfileEditOnPress,
        }}
      />
    );
  };

  return (
    <Stack.Navigator headerMode="none" initialRouteName={AppRoute.PROFILE}>
      <Stack.Screen name={AppRoute.PROFILE} component={profileScreen} />
    </Stack.Navigator>
  );
};
