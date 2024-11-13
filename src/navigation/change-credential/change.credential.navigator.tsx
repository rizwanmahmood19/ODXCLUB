import React from 'react';

import { AppRoute } from '../app.routes';
import { createStackNavigator } from '@react-navigation/stack';
import { ChangeCredentialMailNavigator } from './mail/change.credential.mail.navigator';
import { ChangeCredentialPhoneNumberNavigator } from './phone/change.credential.phone.number.navigator';
import { AppNavigatorParams, noAnimation } from '../app.navigator';

export type ChangeCredentialNavigatorParams = AppNavigatorParams & {
  [AppRoute.CHANGE_CREDENTIAL_MAIL]: { addBehaviour: boolean };
  [AppRoute.CHANGE_CREDENTIAL_PHONE_NUMBER]: { addBehaviour: boolean };
};

const Stack = createStackNavigator<ChangeCredentialNavigatorParams>();

export const ChangeCredentialNavigator = () => {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen
        name={AppRoute.CHANGE_CREDENTIAL_MAIL}
        component={ChangeCredentialMailNavigator}
        options={noAnimation}
      />
      <Stack.Screen
        name={AppRoute.CHANGE_CREDENTIAL_PHONE_NUMBER}
        component={ChangeCredentialPhoneNumberNavigator}
        options={noAnimation}
      />
    </Stack.Navigator>
  );
};
