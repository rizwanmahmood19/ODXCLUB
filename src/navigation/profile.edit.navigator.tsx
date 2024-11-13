import React from 'react';

import { AppRoute } from './app.routes';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { ProfileTabNavigationProp } from './home.navigator';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { ProfileEditScreen } from '../scenes/profile';

type ProfileEditNavigatorParams = {
  [AppRoute.PROFILE_EDIT]: { showPreview: boolean };
  [AppRoute.PROFILE_EDIT_PHOTOS]: undefined;
};

export interface ProfileEditNavigationProps {
  navigation: CompositeNavigationProp<
    ProfileTabNavigationProp,
    StackNavigationProp<ProfileEditNavigatorParams, AppRoute.PROFILE_EDIT>
  >;
  route: RouteProp<ProfileEditNavigatorParams, AppRoute.PROFILE_EDIT>;
}

const Stack = createStackNavigator<ProfileEditNavigatorParams>();

export const ProfileEditNavigator = (props: ProfileEditNavigationProps) => {
  const { navigation, route } = props;

  const goBack = () => {
    navigation.navigate(AppRoute.PROFILE);
  };

  const goToEditPhotos = () => {
    navigation.navigate(AppRoute.PROFILE_EDIT_PHOTOS);
  };

  const profileEditScreen = () => (
    <ProfileEditScreen
      navigation={{ goBack, goToEditPhotos }}
      showPreview={route.params.showPreview}
    />
  );

  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={AppRoute.PROFILE_EDIT}>
      <Stack.Screen
        name={AppRoute.PROFILE_EDIT}
        component={profileEditScreen}
      />
    </Stack.Navigator>
  );
};
