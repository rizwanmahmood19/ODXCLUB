import React, { useContext } from 'react';

import { ChangeCredentialNavigatorParams } from '../change.credential.navigator';
import { ChangeCredentialPhoneNumberScreen } from '../../../scenes/change-credential/change.credential.phone.number.component';
import { ChangeCredentialPhone } from '../../app.routes';
import { SignUpPhoneProvider } from '../../../scenes/auth/signup.phone.state';
import { createStackNavigator } from '@react-navigation/stack';
import { currentUser } from '../../../services/authentication';
import { ChangeCredentialPhoneNumberVerifyNewNumberComponent } from '../../../scenes/change-credential/change.credential.phone.number.verify.new.number.component';
import { ChangeCredentialPhoneNumberEnterPasswordComponent } from '../../../scenes/change-credential/change.credential.phone.number.enter.password.component';
import { noAnimation } from '../../app.navigator';
import { LocalizationContext } from '../../../services/LocalizationContext';

export type ChangeCredentialPhoneNumberNavigatorParams =
  ChangeCredentialNavigatorParams & {
    [ChangeCredentialPhone.ENTER_NEW_NUMBER]: undefined;
    [ChangeCredentialPhone.ENTER_PASSWORD]: undefined;
    [ChangeCredentialPhone.VERIFY]: undefined;
  };

const Stack =
  createStackNavigator<ChangeCredentialPhoneNumberNavigatorParams>();

export const ChangeCredentialPhoneNumberNavigator = (props: any) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);

  const currentPhoneNumber = currentUser()?.phoneNumber;

  const enterNewPhoneNumber = () => {
    return (
      <ChangeCredentialPhoneNumberScreen
        navigation={{
          onBack: () => {
            navigation.goBack();
          },
          onNext: () => {
            navigation.navigate(
              currentPhoneNumber
                ? ChangeCredentialPhone.VERIFY
                : ChangeCredentialPhone.ENTER_PASSWORD,
            );
          },
        }}
        wording={{
          title: currentPhoneNumber
            ? l10n.changePhone.title
            : l10n.profile.settings.form.addPhone,
        }}
      />
    );
  };

  const enterPassword = () => {
    return (
      <ChangeCredentialPhoneNumberEnterPasswordComponent
        navigation={{
          onBack: () => {
            navigation.navigate(ChangeCredentialPhone.ENTER_NEW_NUMBER);
          },
          onNext: () => {
            navigation.navigate(ChangeCredentialPhone.VERIFY);
          },
        }}
        wording={{
          title: l10n.profile.settings.form.addPhone,
          desc: l10n.changePhone.confirmDesc,
        }}
      />
    );
  };

  const verifyNewNumber = () => {
    return (
      <ChangeCredentialPhoneNumberVerifyNewNumberComponent
        navigation={{
          onNext: () => {
            navigation.goBack();
          },
          onBack: () => {
            navigation.navigate(
              currentPhoneNumber
                ? ChangeCredentialPhone.ENTER_NEW_NUMBER
                : ChangeCredentialPhone.ENTER_PASSWORD,
            );
          },
        }}
        wording={{
          title: currentPhoneNumber
            ? l10n.changePhone.title
            : l10n.profile.settings.form.addPhone,
        }}
      />
    );
  };

  return (
    <SignUpPhoneProvider>
      <Stack.Navigator
        headerMode="none"
        initialRouteName={ChangeCredentialPhone.ENTER_NEW_NUMBER}>
        <Stack.Screen
          name={ChangeCredentialPhone.ENTER_NEW_NUMBER}
          component={enterNewPhoneNumber}
          options={noAnimation}
        />
        <Stack.Screen
          name={ChangeCredentialPhone.ENTER_PASSWORD}
          component={enterPassword}
          options={noAnimation}
        />
        <Stack.Screen
          name={ChangeCredentialPhone.VERIFY}
          component={verifyNewNumber}
          options={noAnimation}
        />
      </Stack.Navigator>
    </SignUpPhoneProvider>
  );
};
