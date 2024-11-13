import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { AppRoute } from './app.routes';
import { PhotoEditScreen } from '../scenes/profile';

export type PhotoEditNavigatorParams = {
  [AppRoute.PHOTO_EDIT]: {
    photo: { base64: string; path?: string };
  };
  [AppRoute.PROFILE_EDIT_PHOTOS]: undefined;
};

export interface PhotoEditNavigationProps {
  navigation: StackNavigationProp<
    PhotoEditNavigatorParams,
    AppRoute.PHOTO_EDIT
  >;
  route: RouteProp<PhotoEditNavigatorParams, AppRoute.PHOTO_EDIT>;
}

const Stack = createStackNavigator<PhotoEditNavigatorParams>();

export const PhotoEditNavigator = (props: PhotoEditNavigationProps) => {
  const { route, navigation } = props;

  const photoEdit = () => (
    <PhotoEditScreen photoUrl={route.params.photo} goBack={navigation.goBack} />
  );

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={AppRoute.PHOTO_EDIT} component={photoEdit} />
    </Stack.Navigator>
  );
};
