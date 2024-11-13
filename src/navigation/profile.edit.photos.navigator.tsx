import React from 'react';

import { AppRoute } from './app.routes';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { ProfileTabNavigationProp } from './home.navigator';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { ProfileEditPhotosScreen } from '../scenes/profile';

type ProfileEditPhotosNavigatorParams = {
  [AppRoute.PROFILE_EDIT]: undefined;
  [AppRoute.PHOTO_EDIT]: { photo: { base64: string; path?: string } };
  [AppRoute.PROFILE_EDIT_PHOTOS]: undefined;
};

export interface ProfileEditNavigationProps {
  navigation: CompositeNavigationProp<
    ProfileTabNavigationProp,
    StackNavigationProp<
      ProfileEditPhotosNavigatorParams,
      AppRoute.PROFILE_EDIT_PHOTOS
    >
  >;
  route: RouteProp<
    ProfileEditPhotosNavigatorParams,
    AppRoute.PROFILE_EDIT_PHOTOS
  >;
}

const Stack = createStackNavigator<ProfileEditPhotosNavigatorParams>();

export const ProfileEditPhotosNavigator = (
  props: ProfileEditNavigationProps,
) => {
  const { navigation } = props;

  const handlePhotoSelect = (photo: { base64: string; path?: string }) => {
    navigation.navigate(AppRoute.PHOTO_EDIT, { photo });
  };

  const goToProfileEdit = () => navigation.navigate(AppRoute.PROFILE_EDIT);

  const profileEditPhotosScreen = () => (
    <ProfileEditPhotosScreen
      navigation={{ onPhotoSelect: handlePhotoSelect, goToProfileEdit }}
    />
  );

  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={AppRoute.PROFILE_EDIT_PHOTOS}>
      <Stack.Screen
        name={AppRoute.PROFILE_EDIT_PHOTOS}
        component={profileEditPhotosScreen}
      />
    </Stack.Navigator>
  );
};
