import React, { useContext } from 'react';

import { SignUpMailContext } from './signup.mail.state';
import { useSignUp } from './useSignUp';
import { LocalizationContext } from '../../services/LocalizationContext';
import { parseFirebaseSignUpError } from '../../services/authentication';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

const useSignUpMailEnterPasswordSelector = () => {
  const { state } = useContext(SignUpMailContext);
  const { l10n } = useContext(LocalizationContext);
  const { signUp } = useSignUp();

  const [isLoading, setIsLoading] = React.useState(false);

  const [error, setError] =
    React.useState<Error | string | undefined>(undefined);

  const signUpWithPassword = async (password: string) => {
    setError(undefined);
    setIsLoading(true);

    const signUpError = await signUp(state.email, password);
    if (signUpError) {
      if (typeof signUpError === 'string') {
        setError(parseFirebaseSignUpError(signUpError, l10n));
      } else {
        setError(signUpError);
      }
      setIsLoading(false);
      logEvent(FunnelEvents.emailRegistrationSuccessful);
    } else {
      logEvent(FunnelEvents.emailRegistrationUnsuccessful);
    }
  };

  return {
    password: state.password,
    error,
    isLoading,
    signUpWithPassword,
  };
};

export default useSignUpMailEnterPasswordSelector;
