import React, { useContext } from 'react';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';

import AuthFooter from '../../components/auth/auth.footer.component';
import useSignUpMailEnterPasswordSelector from './signup.mail.enter.password.selector.component';

import { LocalizationContext } from '../../services/LocalizationContext';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import styles from './style';
import { PasswordRepeatComponent } from '../../components/auth/passwordRepeat.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import { SignUpMailContext } from './signup.mail.state';

export interface SignUpMailEnterPasswordScreenProps {
  backButtonOnPress: () => void;
  skipSignUp?: () => void;
  wording: {
    title: string;
  };
}

export const SignUpMailEnterPasswordScreen = (
  props: SignUpMailEnterPasswordScreenProps,
) => {
  const { backButtonOnPress, skipSignUp, wording } = props;
  const { dispatch } = useContext(SignUpMailContext);

  const { password, error, isLoading, signUpWithPassword } =
    useSignUpMailEnterPasswordSelector();

  const { l10n } = useContext(LocalizationContext);

  const handlePasswordSubmittedByUser = async (providedPassword: string) => {
    if (typeof skipSignUp === 'function') {
      dispatch({ type: 'setPassword', password: providedPassword });
      skipSignUp();
    } else {
      signUpWithPassword(providedPassword);
    }
  };

  return (
    <View flex useSafeArea={true} style={styles.screen}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <LogoIcon
            width={styles.logo.width}
            height={styles.logo.height}
            style={styles.logo}
          />
          <Headline type="h1" style={styles.text80}>
            {wording.title}
          </Headline>
          <View style={styles.space_m} />
          <InfoText style={styles.text80}>
            {l10n.screens.SIGN_IN_ENTER_PASSWORD}
          </InfoText>
          <View style={styles.space_m} />
          <InfoText style={styles.text80}>
            {l10n.screens.SIGN_IN_ENTER_PASSWORD_STRENGTH}
          </InfoText>
          <View style={styles.space_l} />
          <PasswordRepeatComponent
            signUpError={error}
            initialPassword={password}
            isLoading={isLoading}
            onPasswordSubmit={handlePasswordSubmittedByUser}
          />
        </View>
        <AuthFooter title={l10n.screens.BACK} onPress={backButtonOnPress} />
      </KeyboardAwareScrollView>
    </View>
  );
};
