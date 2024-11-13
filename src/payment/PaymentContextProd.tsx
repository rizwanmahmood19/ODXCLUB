import { Alert, EmitterSubscription, Platform } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { itemSkus } from './items';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { is_android, is_iOS } from '../util/osCheck';
import { LocalizationContext } from '../services/LocalizationContext';
import { useAxios } from '../util/useAxios';
import { captureException, captureMessage } from '@sentry/react-native';
import { getVersion } from 'react-native-device-info';
import {
  AppsFlyerEvents,
  extractUserProfileEventValues,
} from '../analytics/appsflyer.analytics';
import { ProfileContext } from '../states/profile.state';
import { ASYNC_STORAGE_KEYS, SUBSCRIPTION_ID } from '../constants';
import { TrackingContext } from '../analytics/tracking.context';
import { noop } from '../util/noop';
import RN_IAP, {
  InAppPurchase,
  ProductPurchase,
  PurchaseError,
  Subscription,
  SubscriptionPurchase,
} from 'react-native-iap';

type PartialPurchase = Pick<
  SubscriptionPurchase,
  'productId' | 'transactionReceipt'
>;

export enum SubscriptionState {
  ACTIVE,
  CANCELED,
  NO_EXIST,
}

export type PaymentContextState = {
  isWaitingModalVisible: boolean;
  dismissWaitingModal: () => void;
  isPaymentDataReady: boolean;
  subscriptionState: SubscriptionState;
  error?: Error | PurchaseError;
  isLoading: boolean;
  restorePurchase: () => Promise<PartialPurchase | null>;
  subscriptionInfo?: Subscription;
  requestSubscription: () => Promise<void>;
};

export const PaymentContextProd = React.createContext<PaymentContextState>({
  isWaitingModalVisible: false,
  dismissWaitingModal: noop,
  isPaymentDataReady: false,
  requestSubscription: () => Promise.resolve(),
  subscriptionState: SubscriptionState.NO_EXIST,
  restorePurchase: () => Promise.resolve(null),
  isLoading: false,
});

export const PaymentProviderProd: React.FC = ({ children }) => {
  const { l10n } = useContext(LocalizationContext);
  const purchaseTimeout = useRef<undefined | number>();
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state: profileState } = useContext(ProfileContext);
  const { logAppsFlyerEvent } = useContext(TrackingContext);
  const [, verifyReceipt] = useAxios({
    method: 'POST',
    url: 'payment/validate-receipt-ios',
  });
  const [isPaymentDataReady, setIsPaymentDataReady] = useState<boolean>(false);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<Subscription | undefined>(); // subscription information (title, price, etc.)
  const [error, setError] = useState<Error | PurchaseError | undefined>();
  const [subscriptionState, setSubscriptionState] = useState(
    SubscriptionState.NO_EXIST,
  );
  const purchaseListener = useRef<{
    update?: EmitterSubscription;
    error?: EmitterSubscription;
  }>({});
  const logSuccessfulPayment = async () => {
    try {
      logAppsFlyerEvent(AppsFlyerEvents.CompletePaymentTotal);
      if (profileState.profile?.gender) {
        logAppsFlyerEvent(
          AppsFlyerEvents.CompletePayment[profileState.profile?.gender],
          extractUserProfileEventValues(profileState.profile),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };
  const registerSubscriptionUpdateListener = () => {
    if (purchaseListener.current.update) {
      purchaseListener.current.update.remove();
    }
    try {
      purchaseListener.current.update = RN_IAP.purchaseUpdatedListener(
        async (
          purchase: InAppPurchase | SubscriptionPurchase | ProductPurchase,
        ) => {
          setIsWaitingModalVisible(false);
          if (purchaseTimeout.current) {
            clearTimeout(purchaseTimeout.current);
          }
          setIsLoading(false);
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            if (is_android && !purchase.purchaseToken) {
              setError(new Error('Missing purchaseToken'));
              return;
            }
            if (!purchase.transactionReceipt) {
              setError(new Error('Missing transactionReceipt'));
              return;
            }
            if (!purchase.transactionId) {
              setError(new Error('Missing transactionId'));
              return;
            }
            await handleSuccessfulPurchase({
              transactionReceipt: purchase.transactionReceipt,
              productId: purchase.transactionReceipt,
            });
            // Tell the store that we have delivered what has been paid for.
            // Failure to do this will result in the purchase being refunded on Android and
            // the purchase event will reappear on every relaunch of the app until you succeed
            // in doing the below. It will also be impossible for the user to purchase consumables
            // again until you do this.
            if (Platform.OS === 'ios') {
              await RN_IAP.finishTransactionIOS(purchase.transactionId);
            } else if (Platform.OS === 'android' && purchase.purchaseToken) {
              await RN_IAP.acknowledgePurchaseAndroid(purchase.purchaseToken);
            }
            await RN_IAP.finishTransaction(purchase, false);
            logSuccessfulPayment();
          }
        },
      );
    } catch (e) {
      setError(e);
    }
  };

  const registerErrorListener = () => {
    if (purchaseListener.current.error) {
      purchaseListener.current.error.remove();
    }
    purchaseListener.current.error = RN_IAP.purchaseErrorListener(
      (e: PurchaseError) => {
        setIsWaitingModalVisible(false);
        if (purchaseTimeout.current) {
          clearTimeout(purchaseTimeout.current);
        }
        setIsLoading(false);
        if (e.code === 'E_USER_CANCELLED') {
          return;
        }
        /**
         * errors to handle:
         * 1. connection problem
         *    E_NETWORK_ERROR
         * 2. problem at store
         *    E_UNKNOWN
         *    E_REMOTE_ERROR
         *    E_ITEM_UNAVAILABLE
         *    E_SERVICE_ERROR
         *    E_NOT_PREPARED
         * 3. could not load lib
         *    E_IAP_NOT_AVAILABLE
         * 4. problem with payment process
         *    E_RECEIPT_FAILED
         *    E_RECEIPT_FINISHED_FAILED
         *  5. already running sub
         *    E_NOT_ENDED
         *    E_ALREADY_OWNED
         *    E_DEFERRED_PAYMENT
         */
        console.error('purchaseErrorListener', e);
        Alert.alert(
          l10n.subscription.gallery.error.purchase,
          `${e.message} (code: ${e.code})`,
        );
        setError(e);
      },
    );
    return;
  };

  const requestSubscription = async () => {
    registerSubscriptionUpdateListener();
    registerErrorListener();

    setIsLoading(true);
    purchaseTimeout.current = setTimeout(() => {
      setIsWaitingModalVisible(true);
    }, 5000) as unknown as number;
    await RN_IAP.requestSubscription(itemSkus[0]);
  };

  const getCachedPurchase = async (): Promise<null | SubscriptionPurchase> => {
    try {
      const cachedPurchase: string | null = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.CACHED_PURCHASE,
      );
      if (!cachedPurchase) {
        return null;
      }
      const { timestamp, purchase } = JSON.parse(cachedPurchase);
      if (moment.unix(timestamp).isAfter(moment())) {
        return purchase;
      }
    } catch (ignored) {}
    return null;
  };

  const handleSuccessfulPurchase = async (
    purchase: PartialPurchase | SubscriptionPurchase,
  ): Promise<PartialPurchase> => {
    setSubscriptionState(SubscriptionState.ACTIVE);
    await AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.CACHED_PURCHASE,
      JSON.stringify({
        timestamp: moment().add('1', 'day').unix(),
        purchase: purchase,
      }),
    );
    setIsPaymentDataReady(true);
    setIsWaitingModalVisible(false);
    return purchase;
  };
  const restorePurchase = async (): Promise<PartialPurchase | null> => {
    if (is_iOS) {
      setIsWaitingModalVisible(true);
    }
    const purchases = await RN_IAP.getAvailablePurchases();
    purchases.sort((a, b) => b.transactionDate - a.transactionDate);
    const purchase = purchases.find((p) => p.productId === SUBSCRIPTION_ID);
    if (purchase) {
      if (is_android) {
        // in android inactive subscriptions don't show up in getAvailablePurchases() => we cannot see whether it was canceled
        return handleSuccessfulPurchase(purchase);
      } else {
        setIsWaitingModalVisible(true);
        const { response } = await verifyReceipt({
          data: {
            receipt: purchase.transactionReceipt,
          },
        });
        setIsWaitingModalVisible(false);
        if (response.data === true) {
          return handleSuccessfulPurchase(purchase);
        }
        setSubscriptionState(SubscriptionState.CANCELED);
        setError(new Error('Could not validate receipt'));
        return null;
      }
    }
    setError(new Error('We could not find a valid purchase.'));
    return null;
  };

  const fetchSubscription = async () => {
    try {
      const subscriptions = await RN_IAP.getSubscriptions(itemSkus);
      const sub = subscriptions.find((s) => s.productId === SUBSCRIPTION_ID);
      setSubscriptionInfo(sub);
      if (!sub && !__DEV__) {
        captureMessage(
          'Failed to load subscription data on a production device.',
          {
            extra: { version: getVersion(), os: Platform.OS },
          },
        );
      }
      return;
    } catch (fetchError) {
      console.error(fetchError);
      captureException(fetchError, {
        extra: { event: 'FAILED TO FETCH SUBSCRIPTIONS' },
      });
    }
    console.log('Could not load subscription information from store.');
  };

  const dismissWaitingModal = () => {
    setIsWaitingModalVisible(false);
    setIsLoading(false);
  };

  /**
   * Determines initially if a subscription is available.
   */
  const hasActivePurchase = async () => {
    // For Android we can directly restore the purchase, since this process is silent
    if (is_android) {
      return !!(await restorePurchase());
    }
    // For iOS we can try to get the latest receipt and check whether it is valid.
    const receipt = await RN_IAP.getReceiptIOS();
    const { response } = await verifyReceipt({
      data: {
        receipt: receipt,
      },
    });
    if (response.data === true) {
      return handleSuccessfulPurchase({
        productId: SUBSCRIPTION_ID,
        transactionReceipt: receipt,
      });
    }
    return undefined;
  };

  const onMount = async () => {
    const purchase = await getCachedPurchase();
    if (purchase?.productId === SUBSCRIPTION_ID) {
      setSubscriptionState(SubscriptionState.ACTIVE);
      setIsPaymentDataReady(true);
    } else {
      await RN_IAP.initConnection();
      if (!(await hasActivePurchase())) {
        registerSubscriptionUpdateListener();
        registerErrorListener();
        await fetchSubscription();
      }
      setIsPaymentDataReady(true);
    }
  };

  useEffect(() => {
    onMount();
    return () => {
      if (purchaseListener.current.error) {
        purchaseListener.current.error.remove();
      }
      if (purchaseListener.current.update) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        purchaseListener.current.update.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaymentContextProd.Provider
      value={{
        isWaitingModalVisible,
        dismissWaitingModal,
        isLoading,
        restorePurchase,
        subscriptionState,
        requestSubscription,
        isPaymentDataReady,
        error,
        subscriptionInfo,
      }}>
      {children}
    </PaymentContextProd.Provider>
  );
};
