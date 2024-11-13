import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AppRoute } from './app.routes';
import { AcceptTOSScreen, SubscriptionScreen } from '../scenes/app-blocker';
import { ProfileContext } from '../states/profile.state';
import { SubscriptionState } from '../payment/PaymentContextProd';
import { LoadingScreen } from '../scenes/loading';
import { PaymentContext } from '../payment';

type AppBlockerNavigatorParams = {
  [AppRoute.APP_BLOCKER]: undefined;
};

const Stack = createStackNavigator<AppBlockerNavigatorParams>();

export const AppBlockerNavigator = () => {
  const {
    state: { profile },
  } = useContext(ProfileContext);
  const { subscriptionState, isPaymentDataReady } = useContext(PaymentContext);

  const renderScreen = () => {
    if (profile && !profile.tosAccepted) {
      return (
        <Stack.Screen name={AppRoute.APP_BLOCKER} component={AcceptTOSScreen} />
      );
    }
    if (subscriptionState !== SubscriptionState.ACTIVE && isPaymentDataReady) {
      return (
        <Stack.Screen
          name={AppRoute.APP_BLOCKER}
          component={SubscriptionScreen}
        />
      );
    }
    return (
      <Stack.Screen
        name={AppRoute.APP_BLOCKER}
        component={LoadingScreen}
        options={{}}
      />
    );
  };

  return <Stack.Navigator headerMode="none">{renderScreen()}</Stack.Navigator>;
};
