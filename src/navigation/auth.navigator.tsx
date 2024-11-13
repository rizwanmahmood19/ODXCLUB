import React, { useContext, useEffect } from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import { AppRoute } from './app.routes';
import { AppNavigatorParams } from './app.navigator';

import { SignInChoiceNavigator } from './auth.signin.choice.navigator.component';
import { SignUpChoiceNavigator } from './auth.signup.choice.navigator.component';
import { SignUpMailNavigator } from './auth.signup.mail.navigator.component';
import { SignUpPhoneNavigator } from './auth.signup.phone.navigator.component';

import { ForgotPasswordEnterMailScreen } from '../scenes/auth';
import { SignInMailNavigator } from './auth.signin.navigator.mail.component';
import { AuthContext, ForcedSignOutReason } from '../states/auth.state';
import { ChangeCredentialMailSuccessScreen } from '../scenes/change-credential/change.credential.mail.success.component';
import { navigate } from '../services/navigate';
import { LocalizationContext } from '../services/LocalizationContext';

export type AuthNavigatorParams = AppNavigatorParams & {
  [AppRoute.SIGN_UP_CHOICE]: undefined;
  [AppRoute.SIGN_UP_MAIL]: undefined;
  [AppRoute.SIGN_UP_PHONE]: { login: boolean };
  [AppRoute.SIGN_IN_CHOICE]: undefined;
  [AppRoute.SIGN_IN_MAIL]: { forgotPasswordLogin: boolean };
  [AppRoute.FORGOT_PASSWORD_ENTER_MAIL]: undefined;
};

export interface SignUpChoiceNavigationProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_UP_CHOICE>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_UP_CHOICE>;
}

export interface SignUpMailNavigationProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_UP_MAIL>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_UP_MAIL>;
}

export interface SignUpPhoneNavigationProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_UP_PHONE>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_UP_PHONE>;
}

export interface SignInMailNavigationProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_IN_MAIL>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_IN_MAIL>;
}

export interface SignInChoiceNavigationProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_IN_CHOICE>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_IN_CHOICE>;
}

const Stack = createStackNavigator<AuthNavigatorParams>();

export const AuthNavigator = (props: any): React.ReactElement => {
  const { state, dispatch } = useContext(AuthContext);
  const { l10n } = useContext(LocalizationContext);
  const { navigation } = props;

  useEffect(() => {
    if (state.forcedSignOutReason !== undefined) {
      switch (state.forcedSignOutReason) {
        case ForcedSignOutReason.emailNotVerified:
          navigation.navigate(AppRoute.SIGN_IN_MAIL);
          break;
        case ForcedSignOutReason.newMail:
          navigation.navigate(AppRoute.CHANGE_CREDENTIAL_MAIL_SUCCESS, {
            addBehaviour: false,
          });
          break;
        case ForcedSignOutReason.addMail:
          navigation.navigate(AppRoute.CHANGE_CREDENTIAL_MAIL_SUCCESS, {
            addBehaviour: true,
          });
          break;
        default:
          break;
      }

      // reset state
      dispatch({
        type: 'setForcedSignOutReason',
        forcedSignOutReason: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.forcedSignOutReason]);

  const mailSuccessScreen = ({ route }: any) => {
    const addBehaviour = route.params.addBehaviour;
    return (
      <ChangeCredentialMailSuccessScreen
        onNext={() => {
          dispatch({
            type: 'setForcedSignOutReason',
            forcedSignOutReason: undefined,
          });
          navigate(AppRoute.SIGN_IN_MAIL, {});
        }}
        wording={{
          title: addBehaviour
            ? l10n.profile.settings.form.addMail
            : l10n.changeMail.title,
          desc: addBehaviour
            ? l10n.changeMail.verifySuccessDesc
            : l10n.changeMail.successDesc,
          submitTitle: l10n.changeMail.successSubmitTitle,
        }}
      />
    );
  };

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name={AppRoute.SIGN_UP_CHOICE}
        component={SignUpChoiceNavigator}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name={AppRoute.SIGN_UP_MAIL}
        component={SignUpMailNavigator}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name={AppRoute.SIGN_IN_CHOICE}
        component={SignInChoiceNavigator}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name={AppRoute.SIGN_IN_MAIL}
        component={SignInMailNavigator}
        initialParams={{ forgotPasswordLogin: false }}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name={AppRoute.FORGOT_PASSWORD_ENTER_MAIL}
        component={forgotPasswordEnterMailScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name={AppRoute.SIGN_UP_PHONE}
        component={SignUpPhoneNavigator}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name={AppRoute.CHANGE_CREDENTIAL_MAIL_SUCCESS}
        component={mailSuccessScreen}
        options={{
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

const forgotPasswordEnterMailScreen = (props: any) => {
  const { navigation } = props;

  const handleBackButtonOnPress = () => {
    navigation.navigate(AppRoute.SIGN_IN_MAIL, {
      forgotPasswordLogin: false,
    });
  };

  const handleOnSendPasswordResetEmailSuccess = () => {
    navigation.navigate(AppRoute.SIGN_IN_MAIL, { forgotPasswordLogin: true });
  };

  return (
    <ForgotPasswordEnterMailScreen
      navigation={{
        backButtonOnPress: handleBackButtonOnPress,
        onSendPasswordResetEmailSuccess: handleOnSendPasswordResetEmailSuccess,
      }}
    />
  );
};
