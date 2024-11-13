import React from 'react';
import { AppRoute } from './app.routes';
import { SignUpChoiceNavigationProps } from './auth.navigator';

import { SignUpChoiceScreen } from '../scenes/auth';
import logEvent from '../analytics/analytics';
import { FunnelEvents } from '../analytics/analytics.event';

export const SignUpChoiceNavigator = (props: SignUpChoiceNavigationProps) => {
  const { navigation } = props;

  const handleRegisterEmailButtonOnPress = () => {
    logEvent(FunnelEvents.emailRegistration);
    navigation.navigate(AppRoute.SIGN_UP_MAIL);
  };

  const handleRegisterPhoneButtonOnPress = () => {
    logEvent(FunnelEvents.phoneRegistration);
    navigation.navigate(AppRoute.SIGN_UP_PHONE, { login: false });
  };

  const handleAccountAlreadyExistButtonOnPress = () => {
    navigation.navigate(AppRoute.SIGN_IN_CHOICE);
  };

  return (
    <SignUpChoiceScreen
      navigation={{
        registerEmailButtonOnPress: handleRegisterEmailButtonOnPress,
        registerPhoneButtonOnPress: handleRegisterPhoneButtonOnPress,
        alreadySignedUpButtonOnPress: handleAccountAlreadyExistButtonOnPress,
      }}
    />
  );
};
