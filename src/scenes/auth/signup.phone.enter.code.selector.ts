import { useContext, useEffect, useState } from 'react';
import { SignUpPhoneContext } from './signup.phone.state';
import { LocalizationContext } from '../../services/LocalizationContext';
import {
  currentUser,
  extractFirebaseError,
  parseFirebaseSignUpError,
  signInWithPhoneNumber,
  signOut,
} from '../../services/authentication';
import { useCreateProfile, useFetchProfile } from '../profile/profile.selector';
import { ProfileContext } from '../../states/profile.state';
import { AuthContext } from '../../states/auth.state';
import { firebase } from '@react-native-firebase/auth';
import { TrackingContext } from '../../analytics/tracking.context';
import { captureException } from '@sentry/react-native';
import { Alert } from 'react-native';
import { navigate } from '../../services/navigate';
import { AppRoute } from '../../navigation/app.routes';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

const useSignUpPhoneEnterCodeSelector = ({
  isLogin,
}: {
  isLogin?: boolean;
}) => {
  const { l10n } = useContext(LocalizationContext);

  const signUpPhoneContext = useContext(SignUpPhoneContext);
  const profileContext = useContext(ProfileContext);
  const authContext = useContext(AuthContext);
  const trackingContext = useContext(TrackingContext);

  const { createProfile } = useCreateProfile();
  const { fetchProfile } = useFetchProfile({
    onError: () =>
      Alert.alert(
        l10n.profile.failedLoading.title,
        l10n.profile.failedLoading.description,
        [
          {
            onPress: () => {
              signOut();
              navigate(AppRoute.SIGN_UP_CHOICE);
            },
            text: l10n.profile.failedLoading.cancel,
            style: 'cancel',
          },
          {
            onPress: () => fetchProfile(),
            text: l10n.profile.failedLoading.retry,
            style: 'default',
          },
        ],
        { cancelable: false },
      ),
  });
  const { initialTosAgreeId } = useContext(TrackingContext);
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [code, setCode] = useState('');
  useEffect(() => {
    // HINT!
    // Android automatically scans for received SMS in the background and sends the code to firebase.
    // That's why in most cases Android users don't enter the code manually.
    // This callback is needed to get informed when this background action is done.
    // TODO - refactor so there is only one onAuthStateChanged listener in the app
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoading(true);
        await handleAuthentication();
        setIsLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onChange = (confirmationCode: string, isComplete: boolean) => {
    setIsCodeComplete(isComplete);
    setCode(confirmationCode);
  };

  const onResendCode = async () => {
    setIsLoading(true);
    setError(undefined);
    setIsCodeComplete(false);
    setCode('');
    try {
      const result = await signInWithPhoneNumber(
        signUpPhoneContext.state.countryCallingCode.callingCode +
          signUpPhoneContext.state.number,
      );
      signUpPhoneContext.dispatch({
        type: 'setConfirm',
        confirm: result,
      });
    } catch (e) {
      setError(
        parseFirebaseSignUpError(typeof e === 'string' ? e : 'unknown', l10n),
      );
    }
    setIsLoading(false);
  };

  const handleAuthentication = async () => {
    // for phone number authentication there is no difference between sign in and sign up
    // 1) we try to fetch the profile first, when successful => counts as sign in
    await fetchProfile({
      onError: async (fetchError) => {
        if (fetchError.response?.status === 404) {
          console.debug(
            "Our server doesn't know this user yet, so we try to create one.",
          );
          // 2) if backend returns not found for this user, we need to create a new one
          await createProfile({
            data: { initialTosAgreeId },
            onError: async (createError) => {
              console.error(createError.response);
              // the initial tos agree id sent to the backend could not be found
              if (createError.response?.status === 404) {
                // this redirects the application to the tos agree screen
                await trackingContext.resetInitialTosAgree();
                return;
              }
              currentUser()?.delete();
              showGenericError();
            },
            onSuccess: ({ data }) => {
              profileContext.dispatch({
                type: 'setProfile',
                profile: data,
              });
              authContext.dispatch({ type: 'setUser', user: currentUser() });
            },
          });
        } else {
          // in case of any other error occurred, something went wrong and we need to communicate that to the user.
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
                onPress: () => {
                  signOut();
                  navigate(AppRoute.SIGN_UP_CHOICE);
                },
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
        setIsLoading(false);
      },
    });
  };

  const showInvalidCodeError = () => {
    setError(l10n.screens.SIGN_UP_PHONE_ENTER_CODE_ERROR);
  };
  const showGenericError = () => {
    setError(l10n.screens.SIGN_UP_PHONE_GENERIC_ERROR);
  };

  const onSend = async () => {
    if (!isCodeComplete) {
      showInvalidCodeError();
      return;
    }

    setError(undefined);
    setIsLoading(true);

    try {
      await signUpPhoneContext.state.confirm?.confirm(code);
      if (!isLogin) {
        logEvent(FunnelEvents.smsCodeSuccessful);
      }
    } catch (e) {
      console.error(e);
      const errorMessage = extractFirebaseError(e);
      if (typeof errorMessage === 'string') {
        setError(parseFirebaseSignUpError(errorMessage, l10n));
      } else {
        showGenericError();
      }
      setIsLoading(false);
      if (!isLogin) {
        logEvent(FunnelEvents.smsCodeUnsuccessful);
      }
      return;
    }
  };

  return {
    number:
      signUpPhoneContext.state.countryCallingCode.callingCode +
      ' ' +
      signUpPhoneContext.state.number,
    error,
    isLoading,
    onChange,
    onSend,
    onResendCode,
  };
};

export default useSignUpPhoneEnterCodeSelector;
