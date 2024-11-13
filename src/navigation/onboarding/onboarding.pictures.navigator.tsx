import React from 'react';

import { AppRoute, OnboardingRoute } from '../app.routes';
import { OnboardingPicturesNavigationProps } from './onboarding.navigator';
import { OnboardingPicturesScreen } from '../../scenes/onboarding/onboarding.pictures.component';

export const OnboardingPicturesNavigator = (
  props: OnboardingPicturesNavigationProps,
) => {
  const { navigation } = props;

  const handleBack = () => {
    navigation.navigate(OnboardingRoute.SEARCH_SETTINGS);
  };

  const handleNext = () => {
    navigation.navigate(OnboardingRoute.FINISH);
  };

  const handlePhotoSelect = (photo: { base64: string; path?: string }) => {
    navigation.navigate(AppRoute.PHOTO_EDIT, { photo: photo });
  };

  return (
    <OnboardingPicturesScreen
      navigation={{
        back: handleBack,
        next: handleNext,
        onPhotoSelect: handlePhotoSelect,
      }}
    />
  );
};
