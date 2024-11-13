import React, { useContext } from 'react';
import { SignUpMailEnterMailScreen } from '../auth';
import { isEmailValid as emailValidation } from '../../services/validation';
import { LocalizationContext } from '../../services/LocalizationContext';
import { SignUpMailContext } from '../auth/signup.mail.state';

export interface ChangeCredentialMailScreenProps {
  navigation: {
    onBack: () => void;
    onNext: () => void;
  };
  addBehaviour: boolean;
}

const useChangeCredentialMailSelector = () => {
  const { dispatch, state } = useContext(SignUpMailContext);
  const [email, setEmail] = React.useState(state.email);
  const [isEmailValid, setIsEmailValid] = React.useState<boolean>(
    email ? emailValidation(email) : false,
  );

  const onEmailChange = (changedEmail: string) => {
    setEmail(changedEmail);
    dispatch({ type: 'setEmail', email: changedEmail });

    setIsEmailValid(emailValidation(changedEmail));
  };

  return { email, onEmailChange, isEmailValid };
};

export const ChangeCredentialMailScreen = (
  props: ChangeCredentialMailScreenProps,
) => {
  const { navigation, addBehaviour } = props;
  const { l10n } = useContext(LocalizationContext);

  const { isEmailValid, email, onEmailChange } =
    useChangeCredentialMailSelector();
  return (
    <SignUpMailEnterMailScreen
      navigation={{
        nextButtonOnPress: () => {
          navigation.onNext();
        },
        backButtonOnPress: navigation.onBack,
      }}
      selector={{ email, isEmailValid, onEmailChange, isLoading: false }}
      wordings={{
        title: addBehaviour
          ? l10n.profile.settings.form.addMail
          : l10n.changeMail.title,
        desc: addBehaviour
          ? l10n.screens.SIGN_UP_EMAIL_ENTER_MAIL
          : l10n.changeMail.newMailDesc,
      }}
    />
  );
};
