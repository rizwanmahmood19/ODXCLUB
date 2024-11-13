import React, { useContext } from 'react';
import { ChangeCredentialMail } from '../../app.routes';
import { createStackNavigator } from '@react-navigation/stack';
import { ChangeCredentialNavigatorParams } from '../change.credential.navigator';
import { ChangeCredentialMailScreen } from '../../../scenes/change-credential/change.credential.mail.component';
import { ChangeCredentialMailEnterPasswordScreen } from '../../../scenes/change-credential/change.credential.mail.enter.password.component';
import { AuthContext } from '../../../states/auth.state';
import { SignUpMailProvider } from '../../../scenes/auth/signup.mail.state';
import { ChangeCredentialEnterPasswordMatchScreen } from '../../../scenes/change-credential/change.credential.mail.enter.passwords.match.component';
import { ChangeCredentialMailVerifyCodeScreen } from '../../../scenes/change-credential/change.credential.mail.verify.code.component';
import { noAnimation } from '../../app.navigator';

export type ChangeCredentialMailNavigatorParams =
  ChangeCredentialNavigatorParams & {
    [ChangeCredentialMail.ENTER_NEW_MAIL]: undefined;
    [ChangeCredentialMail.ENTER_PASSWORD]: undefined;
    [ChangeCredentialMail.VERIFY]: undefined;
  };

const Stack = createStackNavigator<ChangeCredentialMailNavigatorParams>();

export const ChangeCredentialMailNavigator = (props: any) => {
  const { state } = useContext(AuthContext);
  const { navigation, route } = props;

  const isAddBehaviour = route.params.addBehaviour;

  const enterNewMail = () => {
    return (
      <ChangeCredentialMailScreen
        navigation={{
          onBack: () => {
            navigation.goBack();
          },
          onNext: () => {
            navigation.navigate(ChangeCredentialMail.ENTER_PASSWORD);
          },
        }}
        addBehaviour={isAddBehaviour}
      />
    );
  };

  const enterPassword = () => {
    if (state.user?.email) {
      return (
        <ChangeCredentialMailEnterPasswordScreen
          navigation={{
            onBack: () => {
              navigation.navigate(ChangeCredentialMail.ENTER_NEW_MAIL);
            },
          }}
        />
      );
    }

    return (
      <ChangeCredentialEnterPasswordMatchScreen
        navigation={{
          onBack: () => {
            navigation.navigate(ChangeCredentialMail.ENTER_NEW_MAIL);
          },
          onNext: () => {
            navigation.navigate(ChangeCredentialMail.VERIFY);
          },
        }}
      />
    );
  };

  const verifyChange = () => {
    return (
      <ChangeCredentialMailVerifyCodeScreen
        navigation={{
          onBack: () => {
            navigation.navigate(ChangeCredentialMail.ENTER_PASSWORD);
          },
        }}
      />
    );
  };

  return (
    <SignUpMailProvider>
      <Stack.Navigator
        headerMode="none"
        initialRouteName={ChangeCredentialMail.ENTER_NEW_MAIL}>
        <Stack.Screen
          name={ChangeCredentialMail.ENTER_NEW_MAIL}
          component={enterNewMail}
          options={noAnimation}
        />
        <Stack.Screen
          name={ChangeCredentialMail.ENTER_PASSWORD}
          component={enterPassword}
          options={noAnimation}
        />
        <Stack.Screen
          name={ChangeCredentialMail.VERIFY}
          component={verifyChange}
          options={noAnimation}
        />
      </Stack.Navigator>
    </SignUpMailProvider>
  );
};
