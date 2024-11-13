import React from 'react';

import { OnboardingRoute } from '../app.routes';
import { OnboardingFinishNavigationProps } from './onboarding.navigator';
import { OnboardingFinishScreen } from '../../scenes/onboarding/onboarding-finish/onboarding.finish.component';

export const OnboardingFinishNavigator = (
  props: OnboardingFinishNavigationProps,
) => {
  const { navigation } = props;

  const handleRestart = () => {
    navigation.navigate(OnboardingRoute.NAME);
  };

  return (
    <OnboardingFinishScreen
      navigation={{
        restart: handleRestart,
      }}
    />
  );
};
