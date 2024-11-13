import React, { useContext, useEffect } from 'react';
import { Alert, TextInput } from 'react-native';

import { isEmailValid } from '../../services/validation';
import {
  currentUser,
  FirebaseAuthError,
  signIn as externalSignIn,
  signOut,
} from '../../services/authentication';
import { LocalizationContext } from '../../services/LocalizationContext';
import { BlockedUserContext } from '../../states/blocked.user.state';
import { AuthContext } from '../../states/auth.state';
import { useFetchProfile } from '../profile/profile.selector';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

const useSignInMailSelector = () => {
  const { fetchProfile } = useFetchProfile({
    onError: (e) => {
      console.error(e.response?.data);
      Alert.alert(
        l10n.profile.failedLoading.title,
        l10n.profile.failedLoading.description,
        [
          {
            onPress: () => signOut(),
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
      );
    },
  });
  const { l10n } = useContext(LocalizationContext);
  const blockedUserContext = useContext(BlockedUserContext);
  const { dispatch } = useContext(AuthContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSigInButtonEnabled, setIsSigInButtonEnabled] = React.useState(false);
  const [error, setError] =
    React.useState<Error | string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const emailRef = React.createRef<TextInput>();
  const passwordRef = React.createRef<TextInput>();

  const onEmailSubmitEditing = () => {
    if (passwordRef?.current) {
      passwordRef.current.focus();
    }
  };

  useEffect(() => {
    if (error) {
      setError(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setIsSigInButtonEnabled(
        isEmailValid(email) && password.length > 0 && !isLoading,
      );
    }
    return () => {
      isMounted = false;
    };
  }, [email, password, isLoading]);

  const onChangeEmail = (changedEmail: string) => {
    setEmail(changedEmail);
  };

  const onChangePassword = (changedPassword: string) => {
    setPassword(changedPassword);
  };

  const onPasswordVisibilityChange = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const shouldUseGeneralSignInError = (e: any): boolean => {
    if (typeof e !== 'string') {
      return false;
    }

    switch (e) {
      case FirebaseAuthError.invalidEmail:
      case FirebaseAuthError.userNotFound:
      case FirebaseAuthError.wrongPassword:
        return true;
      default:
        return false;
    }
  };

  const onLogin = async () => {
    setError(undefined);
    setIsLoading(true);
    try {
      await externalSignIn(email, password);
      await fetchProfile({
        onSuccess: () => {
          dispatch({ type: 'setUser', user: currentUser() });
        },
      });
      blockedUserContext.dispatch({
        type: 'setBlockedUser',
        isUserBlocked: false,
      });
      logEvent(FunnelEvents.emailLoginSuccessful);
    } catch (e) {
      console.error(e);
      logEvent(FunnelEvents.emailLoginUnsuccessful);
      if (shouldUseGeneralSignInError(e)) {
        setError(l10n.error.auth.invalidEmailOrPassword);
      } else {
        if (e === FirebaseAuthError.userDisabled) {
          blockedUserContext.dispatch({
            type: 'setBlockedUser',
            isUserBlocked: true,
          });
        } else {
          setError(e);
        }
      }
    }
    setIsLoading(false);
  };

  return {
    email,
    password,
    error,
    isLoading,
    isSigInButtonEnabled,
    isPasswordVisible,
    emailRef,
    passwordRef,
    onChangeEmail,
    onChangePassword,
    onLogin,
    onPasswordVisibilityChange,
    onEmailSubmitEditing,
  };
};

export default useSignInMailSelector;
