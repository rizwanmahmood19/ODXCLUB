import React from 'react';
import { AppRoute } from './app.routes';

import { SignInMailScreen } from '../scenes/auth';
import { SignInMailNavigationProps } from './auth.navigator';

export const SignInMailNavigator = (props: SignInMailNavigationProps) => {
  const { navigation, route } = props;

  const handleForgotPasswordOnPress = () => {
    navigation.navigate(AppRoute.FORGOT_PASSWORD_ENTER_MAIL);
  };

  const handleFooterButtonOnPress = () => {
    navigation.navigate(AppRoute.SIGN_IN_CHOICE);
  };

  return (
    <SignInMailScreen
      forgotPasswordLogin={route.params.forgotPasswordLogin}
      navigation={{
        footerButtonOnPress: handleFooterButtonOnPress,
        forgotPasswordOnPress: handleForgotPasswordOnPress,
      }}
    />
  );
};
