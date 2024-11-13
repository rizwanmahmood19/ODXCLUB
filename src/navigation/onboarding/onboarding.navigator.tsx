import React, { useContext, useEffect } from 'react';

import { AppRoute, OnboardingRoute } from '../app.routes';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { OnboardingNameNavigator } from './onboarding.name.navigator';
import { OnboardingGenderNavigator } from './onboarding.gender.navigator';
import { OnboardingPicturesNavigator } from './onboarding.pictures.navigator';
import { OnboardingFinishNavigator } from './onboarding.finish.navigator';
import { OnboardingSearchSettingsNavigator } from './onboarding.search.settings.navigator';
import { OnboardingBirthdayNavigator } from './onboarding.birthday.navigator';
import { OnboardingPreferredGenderNavigator } from './onboarding.preferred.gender.navigator';

import { AppNavigatorParams } from '../app.navigator';
import { PhotoEditNavigatorParams } from '../photo.edit.navigator';
import { ProfileContext } from '../../states/profile.state';
import logEvent from '../../analytics/analytics';
import { OnboardingEvent } from '../../analytics/analytics.event';

export type OnboardingNavigatorParams = {
  [AppRoute.ONBOARDING]: undefined;
  [OnboardingRoute.NAME]: undefined;
  [OnboardingRoute.BIRTHDAY]: undefined;
  [OnboardingRoute.GENDER]: undefined;
  [OnboardingRoute.PREFERRED_GENDER]: undefined;
  [OnboardingRoute.SEARCH_SETTINGS]: undefined;
  [OnboardingRoute.PICTURES]: { photo: { base64: string; path?: string } };
  [OnboardingRoute.FINISH]: undefined;
};

export interface OnboardingNavigationProps {
  navigation: StackNavigationProp<
    OnboardingNavigatorParams,
    AppRoute.ONBOARDING
  >;
  route: RouteProp<OnboardingNavigatorParams, AppRoute.ONBOARDING>;
}

export interface OnboardingNameNavigationProps {
  navigation: StackNavigationProp<
    OnboardingNavigatorParams,
    OnboardingRoute.NAME
  >;
  route: RouteProp<OnboardingNavigatorParams, OnboardingRoute.NAME>;
}

export interface OnboardingBirthdayNavigationProps {
  navigation: StackNavigationProp<
    OnboardingNavigatorParams,
    OnboardingRoute.BIRTHDAY
  >;
  route: RouteProp<OnboardingNavigatorParams, OnboardingRoute.BIRTHDAY>;
}

export interface OnboardingGenderNavigationProps {
  navigation: StackNavigationProp<
    OnboardingNavigatorParams,
    OnboardingRoute.GENDER
  >;
  route: RouteProp<OnboardingNavigatorParams, OnboardingRoute.GENDER>;
}

export interface OnboardingPreferredGenderNavigationProps {
  navigation: StackNavigationProp<
    OnboardingNavigatorParams,
    OnboardingRoute.PREFERRED_GENDER
  >;
  route: RouteProp<OnboardingNavigatorParams, OnboardingRoute.PREFERRED_GENDER>;
}

export interface OnboardingSearchSettingsNavigationProps {
  navigation: StackNavigationProp<
    OnboardingNavigatorParams,
    OnboardingRoute.SEARCH_SETTINGS
  >;
  route: RouteProp<OnboardingNavigatorParams, OnboardingRoute.SEARCH_SETTINGS>;
}

export interface OnboardingPicturesNavigationProps {
  navigation: StackNavigationProp<
    OnboardingNavigatorParams & AppNavigatorParams,
    OnboardingRoute.PICTURES
  >;
  route: RouteProp<OnboardingNavigatorParams, OnboardingRoute.PICTURES>;
}

export interface OnboardingFinishNavigationProps {
  navigation: StackNavigationProp<
    AppNavigatorParams & OnboardingNavigatorParams & PhotoEditNavigatorParams,
    OnboardingRoute.FINISH
  >;
  route: RouteProp<OnboardingNavigatorParams, OnboardingRoute.FINISH>;
}

const Stack = createStackNavigator<OnboardingNavigatorParams>();

export const OnboardingNavigator = (_props: OnboardingNavigationProps) => {
  const { state } = useContext(ProfileContext);

  useEffect(() => {
    if (state.profile?.name) {
      return;
    }
    logEvent(OnboardingEvent.started);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen
        name={OnboardingRoute.NAME}
        component={OnboardingNameNavigator}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={OnboardingRoute.BIRTHDAY}
        component={OnboardingBirthdayNavigator}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={OnboardingRoute.GENDER}
        component={OnboardingGenderNavigator}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={OnboardingRoute.PREFERRED_GENDER}
        component={OnboardingPreferredGenderNavigator}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={OnboardingRoute.SEARCH_SETTINGS}
        component={OnboardingSearchSettingsNavigator}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={OnboardingRoute.PICTURES}
        component={OnboardingPicturesNavigator}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={OnboardingRoute.FINISH}
        component={OnboardingFinishNavigator}
        options={{ animationEnabled: false }}
      />
    </Stack.Navigator>
  );
};
