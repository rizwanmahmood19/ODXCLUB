import React, { useContext } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { AppRoute } from './app.routes';
import {
  SignUpMailEnterMailScreen,
  SignUpMailEnterPasswordScreen,
} from '../scenes/auth';
import { SignUpMailProvider } from '../scenes/auth/signup.mail.state';
import { SignUpMailNavigationProps } from './auth.navigator';
import useSignUpMailEnterMailSelector from '../scenes/auth/signup.mail.enter.mail.selector.component';
import { LocalizationContext } from '../services/LocalizationContext';
import logEvent from '../analytics/analytics';
import { FunnelEvents } from '../analytics/analytics.event';

export type SignUpMailNavigatorParams = {
  [AppRoute.SIGN_UP_MAIL_ENTER_MAIL]: undefined;
  [AppRoute.SIGN_UP_MAIL_ENTER_PASSWORD]: undefined;
};

const Stack = createStackNavigator<SignUpMailNavigatorParams>();

export const SignUpMailNavigator = (
  _props: SignUpMailNavigationProps,
): React.ReactElement => {
  return (
    <SignUpMailProvider>
      <Stack.Navigator
        headerMode="none"
        initialRouteName={AppRoute.SIGN_UP_MAIL_ENTER_MAIL}>
        <Stack.Screen
          name={AppRoute.SIGN_UP_MAIL_ENTER_MAIL}
          component={EnterMailScreen}
          options={{
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name={AppRoute.SIGN_UP_MAIL_ENTER_PASSWORD}
          component={EnterPasswordScreen}
          options={{
            animationEnabled: false,
          }}
        />
      </Stack.Navigator>
    </SignUpMailProvider>
  );
};

const EnterMailScreen: React.FC = (props: any) => {
  const { l10n } = useContext(LocalizationContext);

  const { navigation } = props;

  const handleNextButtonOnPress = () => {
    logEvent(FunnelEvents.enterEmail);
    navigation.navigate(AppRoute.SIGN_UP_MAIL_ENTER_PASSWORD);
  };

  const handleBackButtonOnPress = () => {
    navigation.navigate(AppRoute.SIGN_UP_CHOICE);
  };

  const { email, isEmailValid, onEmailChange } =
    useSignUpMailEnterMailSelector();

  return (
    <SignUpMailEnterMailScreen
      navigation={{
        backButtonOnPress: handleBackButtonOnPress,
        nextButtonOnPress: handleNextButtonOnPress,
      }}
      selector={{
        email: email,
        isEmailValid: isEmailValid,
        onEmailChange: onEmailChange,
        isLoading: false,
      }}
      wordings={{
        title: l10n.screens.SIGN_UP_EMAIL,
        desc: l10n.screens.SIGN_UP_EMAIL_ENTER_MAIL,
      }}
    />
  );
};

const EnterPasswordScreen = (props: any) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);

  const handleBackButtonOnPress = () => {
    navigation.navigate(AppRoute.SIGN_UP_MAIL_ENTER_MAIL);
  };

  return (
    <SignUpMailEnterPasswordScreen
      backButtonOnPress={handleBackButtonOnPress}
      wording={{ title: l10n.screens.SIGN_UP_EMAIL }}
    />
  );
};
