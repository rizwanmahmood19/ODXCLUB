import React, { useContext } from 'react';
import { SignUpMailEnterPasswordScreen } from '../auth';
import { LocalizationContext } from '../../services/LocalizationContext';

export interface ChangeCredentialEnterPasswordMatchScreenProps {
  navigation: {
    onBack: () => void;
    onNext: () => void;
  };
}

export const ChangeCredentialEnterPasswordMatchScreen = (
  props: ChangeCredentialEnterPasswordMatchScreenProps,
) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);

  return (
    <SignUpMailEnterPasswordScreen
      backButtonOnPress={navigation.onBack}
      skipSignUp={navigation.onNext}
      wording={{ title: l10n.profile.settings.form.addMail }}
    />
  );
};
