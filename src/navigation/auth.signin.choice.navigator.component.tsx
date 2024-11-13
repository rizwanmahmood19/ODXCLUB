import React from 'react';
import { AppRoute } from './app.routes';
import { SignInChoiceNavigationProps } from './auth.navigator';

import { SignInChoiceScreen } from '../scenes/auth/signin.choice.component';

export const SignInChoiceNavigator = (props: SignInChoiceNavigationProps) => {
  const { navigation } = props;

  const handlePhoneSignInOnPress = () => {
    navigation.navigate(AppRoute.SIGN_UP_PHONE, { login: true });
  };

  const handleEmailSignInOnPress = () => {
    navigation.navigate(AppRoute.SIGN_IN_MAIL, { forgotPasswordLogin: false });
  };

  const handleBackButtonOnPress = () => {
    navigation.navigate(AppRoute.SIGN_UP_CHOICE);
  };

  return (
    <SignInChoiceScreen
      navigation={{
        phoneSignInOnPress: handlePhoneSignInOnPress,
        emailSignInOnPress: handleEmailSignInOnPress,
        backButtonOnPress: handleBackButtonOnPress,
      }}
    />
  );
};
