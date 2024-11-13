import { useSignOut } from './useSignOut';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext, ForcedSignOutReason } from '../../states/auth.state';
import * as Sentry from '@sentry/react-native';
import {
  parseFirebaseSignUpError,
  resendVerificationEmail,
} from '../../services/authentication';
import { Alert } from 'react-native';
import { LocalizationContext } from '../../services/LocalizationContext';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

export const useUserMailNotVerifiedSelector = () => {
  const { signOut } = useSignOut();
  const { dispatch } = useContext(AuthContext);
  const { l10n } = useContext(LocalizationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const onResendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      await resendVerificationEmail();
      Alert.alert(
        l10n.screens.SIGN_UP_EMAIL_VERIFICATION_RESEND_SUCCESS_TITLE,
        l10n.screens.SIGN_UP_EMAIL_VERIFICATION_RESEND_SUCCESS_DESCRIPTION,
      );
    } catch (e) {
      setError(parseFirebaseSignUpError(e, l10n));
    }
    setIsLoading(false);
  };

  const onGoToLogin = async () => {
    setIsLoading(true);
    dispatch({
      type: 'setForcedSignOutReason',
      forcedSignOutReason: ForcedSignOutReason.emailNotVerified,
    });
    try {
      // force sign out
      await signOut();
      logEvent(FunnelEvents.goToLogin);
    } catch (e) {
      dispatch({
        type: 'setUser',
        user: null,
      });
      console.error(e);
      Sentry.captureException(e, {
        extra: { where: 'user.mail.not.verified.selector' },
      });
    }
    if (isMounted.current) {
      setIsLoading(false);
    }
  };

  return { onGoToLogin, isLoading, onResendVerificationEmail, error };
};
