import { useState } from 'react';
import { isEmailValid as emailValidation } from '../../services/validation';
import { sendPasswordResetEmail } from '../../services/authentication';

interface useForgotPasswordEnterMailSelectorProps {
  onSendPasswordResetEmailSuccess: () => void;
}

const useForgotPasswordEnterMailSelector = (
  props: useForgotPasswordEnterMailSelectorProps,
) => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(
    emailValidation(email),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const onEmailChange = (changedEmail: string) => {
    setEmail(changedEmail);
    setIsEmailValid(emailValidation(changedEmail));
  };

  const onForgotPassword = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      await sendPasswordResetEmail(email);
      setIsLoading(false);
      props.onSendPasswordResetEmailSuccess();
    } catch (e) {
      setIsLoading(false);
      setError(e);
    }
  };

  return {
    email,
    onEmailChange,
    isEmailValid,
    onForgotPassword,
    isLoading,
    error,
  };
};

export default useForgotPasswordEnterMailSelector;
