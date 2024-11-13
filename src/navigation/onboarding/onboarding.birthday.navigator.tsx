import React from 'react';

import { OnboardingRoute } from '../app.routes';
import { OnboardingBirthdayNavigationProps } from './onboarding.navigator';
import { OnboardingBirthdayScreen } from '../../scenes/onboarding/onboarding.birthday.component';

export const OnboardingBirthdayNavigator = (
  props: OnboardingBirthdayNavigationProps,
) => {
  const { navigation } = props;

  const handleBack = () => {
    navigation.navigate(OnboardingRoute.NAME);
  };

  const handleNext = () => {
    navigation.navigate(OnboardingRoute.GENDER);
  };

  return (
    <OnboardingBirthdayScreen
      navigation={{
        back: handleBack,
        next: handleNext,
      }}
    />
  );
};
