import {
  PurchaseError,
  Subscription,
  SubscriptionPurchase,
} from 'react-native-iap';
import React, { useContext, useEffect, useState } from 'react';
import { PaymentContextState, SubscriptionState } from './PaymentContextProd';
import { Alert } from 'react-native';
import { TrackingContext } from '../analytics/tracking.context';
import { ProfileContext } from '../states/profile.state';
import {
  AppsFlyerEvents,
  extractUserProfileEventValues,
} from '../analytics/appsflyer.analytics';
import { noop } from '../util/noop';

export const PaymentContextDev = React.createContext<PaymentContextState>({
  isPaymentDataReady: false,
  dismissWaitingModal: noop,
  isWaitingModalVisible: false,
  requestSubscription: () => Promise.resolve(),
  subscriptionState: SubscriptionState.NO_EXIST,
  restorePurchase: () => Promise.resolve(null),
  isLoading: false,
});

export const PaymentProviderDev: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentDataReady, setIsPaymentDataReady] = useState<boolean>(false);
  const { logAppsFlyerEvent } = useContext(TrackingContext);
  const { state: profileState } = useContext(ProfileContext);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<Subscription | undefined>(); // subscription information (title, price, etc.)
  const [error, setError] = useState<Error | PurchaseError | undefined>();
  const [subscriptionState, setSubscriptionState] = useState(
    SubscriptionState.NO_EXIST,
  );
  const requestSubscription = async () => {
    setIsLoading(true);
    setTimeout(() => {
      Alert.alert(
        'Payment Dev Modal',
        'Click "cancel" to simulate payment error/cancel and "pay" to simulate payment process.',
        [
          {
            text: 'cancel',
            onPress: () => {
              setIsLoading(false);
            },
          },
          {
            text: 'pay',
            onPress: () => {
              setTimeout(async () => {
                logAppsFlyerEvent(AppsFlyerEvents.CompletePaymentTotal);
                if (profileState.profile?.gender) {
                  logAppsFlyerEvent(
                    AppsFlyerEvents.CompletePayment[
                      profileState.profile?.gender
                    ],
                    extractUserProfileEventValues(profileState.profile),
                  );
                }
                setSubscriptionState(SubscriptionState.ACTIVE);
                setIsLoading(false);
              }, 500);
            },
          },
        ],
      );
    }, 1000);
  };

  const restorePurchase = async (): Promise<SubscriptionPurchase | null> => {
    setError(new Error('Could not restore purchase'));
    return null;
  };

  const onMount = async () => {
    setTimeout(() => {
      setSubscriptionInfo({
        localizedPrice: '1DEV',
      } as any);
      setIsPaymentDataReady(true);
      // setSubscriptionState(SubscriptionState.NO_EXIST);
      setSubscriptionState(SubscriptionState.ACTIVE);
    }, 1000);
  };

  useEffect(() => {
    onMount();
  }, []);

  return (
    <PaymentContextDev.Provider
      value={{
        restorePurchase,
        isLoading,
        subscriptionState,
        requestSubscription,
        isWaitingModalVisible: false,
        dismissWaitingModal: noop,
        isPaymentDataReady,
        error,
        subscriptionInfo,
      }}>
      {children}
    </PaymentContextDev.Provider>
  );
};
