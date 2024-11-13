import { useContext, useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { AuthContext } from '../states/auth.state';
import { ProfileContext } from '../states/profile.state';
import { useTokenChange } from './token.change';
import { useIsOnline } from './isOnline/useIsOnline';
import { useSignOut } from '../scenes/auth/useSignOut';
import { BlockedUserContext } from '../states/blocked.user.state';
import { currentUser } from './authentication';
import { firebase } from '@react-native-firebase/auth';
import { TrackingContext } from '../analytics/tracking.context';
import { SubscriptionState } from '../payment/PaymentContextProd';
import { PaymentContext } from '../payment';
import { SetupContext } from '../states/SetupContext';
import { Alert } from 'react-native';
import { LocalizationContext } from './LocalizationContext';
import { captureException } from '@sentry/react-native';
import { useFetchProfile } from '../scenes/profile/profile.selector';

export const useAppStart = () => {
  const {
    state: { isUserBlocked },
  } = useContext(BlockedUserContext);
  const profileContext = useContext(ProfileContext);
  const { signOut } = useSignOut();
  const authContext = useContext(AuthContext);
  const { l10n } = useContext(LocalizationContext);
  const {
    initialTosAgreeId,
    isLoading: isLoadingTrackingContext,
    trackingStatus,
  } = useContext(TrackingContext);
  const {
    hasDealtWithGPS,
    hasDealtWithPN,
    isLoading: isSetupLoading,
  } = useContext(SetupContext);
  const { subscriptionState, isPaymentDataReady, subscriptionInfo } =
    useContext(PaymentContext);
  const [isLoading, setIsLoading] = useState(true);
  const {
    fetchProfile,
    loading: isLoadingProfile,
    error: profileLoadingError,
  } = useFetchProfile({
    onError: async (error) => {
      if (
        error.response?.data.statusCode === 404 &&
        error.response?.data.message.toLocaleLowerCase().indexOf('not found') >=
          0
      ) {
        console.debug(
          'Profile could not be found, signing out user proactively',
        );
        await signOut();
      } else {
        captureException(error, {
          extra: {
            message:
              'Was not able to load profile, even though the firebase user exists.',
          },
        });
        Alert.alert(
          l10n.profile.failedLoading.title,
          l10n.profile.failedLoading.description,
          [
            {
              onPress: () => signOut(),
              text: l10n.profile.failedLoading.signOut,
              style: 'cancel',
            },
            {
              onPress: () => fetchProfile(),
              text: l10n.profile.failedLoading.retry,
              style: 'default',
            },
          ],
          { cancelable: false },
        );
      }
    },
  });
  useTokenChange();
  useIsOnline();

  useEffect(() => {
    const fetch = async (): Promise<void | (() => void)> => {
      try {
        if (authContext.state.user) {
          await currentUser()?.reload();
          authContext.dispatch({ type: 'setUser', user: currentUser() });
          await fetchProfile();
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        // add listener to check if current user is set after app starts
        // this is necessary because auth().currentUser might not be set initially
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            setIsLoading(true);
            authContext.dispatch({ type: 'setUser', user: user });
            await fetchProfile();
            setIsLoading(false);
          }
        });
        // !HACKY! gives listener time to be called in case current user is not set initially and
        // removes after 1 second to stop it from interfering with the other auth listener
        const timeoutID = setTimeout(() => {
          unsubscribe();
        }, 1000);
        return () => clearTimeout(timeoutID);
      } catch (e) {
        setIsLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && !isSetupLoading) {
      SplashScreen.hide();
    }
  }, [isLoading, isSetupLoading]);

  return {
    isLoading:
      isLoading ||
      isLoadingTrackingContext ||
      isSetupLoading ||
      isLoadingProfile,
    state: authContext.state,
    profileLoadingError,
    profile: profileContext.state.profile,
    paymentProblem:
      isPaymentDataReady &&
      profileContext.state?.profile?.isComplete &&
      subscriptionState !== SubscriptionState.ACTIVE &&
      !!subscriptionInfo,
    hasDealtWithPN,
    hasDealtWithGPS,
    isUserBlocked,
    trackingStatus,
    initialTosAgree: !!initialTosAgreeId,
  };
};
