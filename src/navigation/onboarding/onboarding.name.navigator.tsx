import React from 'react';

import { OnboardingRoute } from '../app.routes';
import { OnboardingNameNavigationProps } from './onboarding.navigator';
import { OnboardingNameScreen } from '../../scenes/onboarding/onboarding.name.component';

export const OnboardingNameNavigator = (
  props: OnboardingNameNavigationProps,
) => {
  const { navigation } = props;

  const handleNext = () => {
    navigation.navigate(OnboardingRoute.BIRTHDAY);
  };

  return (
    <OnboardingNameScreen
      navigation={{
        next: handleNext,
      }}
    />
  );
};
