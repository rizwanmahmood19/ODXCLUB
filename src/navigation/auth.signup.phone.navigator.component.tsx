import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { AppRoute } from './app.routes';
import { SignUpPhoneEnterNumberScreen } from '../scenes/auth';
import { SignUpPhoneProvider } from '../scenes/auth/signup.phone.state';
import { SignUpPhoneEnterCodeScreen } from '../scenes/auth/signup.phone.enter.code.component';

export type SignUpPhoneNavigatorParams = {
  [AppRoute.SIGN_UP_PHONE]: { login: boolean };
  [AppRoute.SIGN_UP_PHONE_ENTER_NUMBER]: { login: boolean };
  [AppRoute.SIGN_UP_PHONE_ENTER_CODE]: { login: boolean };
};

const Stack = createStackNavigator<SignUpPhoneNavigatorParams>();

export const SignUpPhoneNavigator = (
  props: SignUpPhoneNavigatorParams,
): React.ReactElement => {
  return (
    <SignUpPhoneProvider>
      <Stack.Navigator
        headerMode="none"
        initialRouteName={AppRoute.SIGN_UP_PHONE_ENTER_NUMBER}>
        <Stack.Screen
          name={AppRoute.SIGN_UP_PHONE_ENTER_NUMBER}
          component={enterNumberScreen}
          options={{
            animationEnabled: false,
          }}
          initialParams={{ login: props.route.params.login }}
        />
        <Stack.Screen
          name={AppRoute.SIGN_UP_PHONE_ENTER_CODE}
          component={enterCodeScreen}
          options={{
            animationEnabled: false,
          }}
          initialParams={{ login: props.route.params.login }}
        />
      </Stack.Navigator>
    </SignUpPhoneProvider>
  );
};

const enterNumberScreen = (props: any) => {
  const { navigation, route } = props;

  const handleSendOnPress = () => {
    navigation.navigate(AppRoute.SIGN_UP_PHONE_ENTER_CODE, {
      login: route.params.login,
    });
  };

  const handleBackOnPress = () => {
    navigation.navigate(
      route.params.login ? AppRoute.SIGN_IN_CHOICE : AppRoute.SIGN_UP_CHOICE,
    );
  };

  return (
    <SignUpPhoneEnterNumberScreen
      navigation={{
        backOnPress: handleBackOnPress,
        sendOnPress: handleSendOnPress,
      }}
      isLogin={route.params.login}
    />
  );
};

const enterCodeScreen = (props: any) => {
  const { navigation, route } = props;
  const handleBackOnPress = () => {
    navigation.navigate(AppRoute.SIGN_UP_PHONE_ENTER_NUMBER, {
      login: route.params.login,
    });
  };

  return (
    <SignUpPhoneEnterCodeScreen
      navigation={{
        backOnPress: handleBackOnPress,
      }}
      isLogin={route.params.login}
    />
  );
};
