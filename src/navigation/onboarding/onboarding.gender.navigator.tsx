import React from 'react';

import { OnboardingRoute } from '../app.routes';
import { OnboardingGenderNavigationProps } from './onboarding.navigator';
import { OnboardingGenderScreen } from '../../scenes/onboarding/onboarding.gender.component';

export const OnboardingGenderNavigator = (
  props: OnboardingGenderNavigationProps,
) => {
  const { navigation } = props;

  const handleBack = () => {
    navigation.navigate(OnboardingRoute.BIRTHDAY);
  };

  const handleNext = () => {
    navigation.navigate(OnboardingRoute.PREFERRED_GENDER);
  };

  return (
    <OnboardingGenderScreen
      navigation={{
        back: handleBack,
        next: handleNext,
      }}
    />
  );
};
