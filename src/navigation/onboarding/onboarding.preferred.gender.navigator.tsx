import React from 'react';

import { OnboardingRoute } from '../app.routes';
import { OnboardingPreferredGenderNavigationProps } from './onboarding.navigator';
import { OnboardingPreferredGenderScreen } from '../../scenes/onboarding/onboarding.preferred.gender.component';

export const OnboardingPreferredGenderNavigator = (
  props: OnboardingPreferredGenderNavigationProps,
) => {
  const { navigation } = props;

  const handleBack = () => {
    navigation.navigate(OnboardingRoute.GENDER);
  };

  const handleNext = () => {
    navigation.navigate(OnboardingRoute.SEARCH_SETTINGS);
  };

  return (
    <OnboardingPreferredGenderScreen
      navigation={{
        back: handleBack,
        next: handleNext,
      }}
    />
  );
};
