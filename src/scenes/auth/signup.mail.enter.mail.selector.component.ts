import React, { useContext } from 'react';
import { SignUpMailContext } from './signup.mail.state';
import { isEmailValid as emailValidation } from '../../services/validation';

const useSignUpMailEnterMailSelector = () => {
  const { state, dispatch } = useContext(SignUpMailContext);
  const [email, setEmail] = React.useState(state.email);
  const [isEmailValid, setIsEmailValid] = React.useState<boolean>(
    emailValidation(email),
  );

  const onEmailChange = (changedEmail: string) => {
    setEmail(changedEmail);
    setIsEmailValid(emailValidation(changedEmail));
    dispatch({ type: 'setEmail', email: changedEmail });
  };

  return { email, onEmailChange, isEmailValid };
};

export default useSignUpMailEnterMailSelector;
