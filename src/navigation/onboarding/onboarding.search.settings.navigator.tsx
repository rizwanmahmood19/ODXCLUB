import React from 'react';

import { OnboardingRoute } from '../app.routes';
import { OnboardingSearchSettingsNavigationProps } from './onboarding.navigator';
import { OnboardingSearchSettingsScreen } from '../../scenes/onboarding/onboarding.search.settings.component';

export const OnboardingSearchSettingsNavigator = (
  props: OnboardingSearchSettingsNavigationProps,
) => {
  const { navigation } = props;

  const handleBack = () => {
    navigation.navigate(OnboardingRoute.PREFERRED_GENDER);
  };

  const handleNext = () => {
    navigation.navigate(OnboardingRoute.PICTURES);
  };

  return (
    <OnboardingSearchSettingsScreen
      navigation={{
        back: handleBack,
        next: handleNext,
      }}
    />
  );
};
