import React, { useContext } from 'react';

import { ActivityIndicator, TextInput } from 'react-native';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';
import styles from '../auth/style';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import { appColors } from '../../style/appColors';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import AuthFooter from '../../components/auth/auth.footer.component';
import PasswordTextField from '../../components/custom/password.text.field.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import {
  parseFirebaseSignUpError,
  reauthenticateWithEmail,
} from '../../services/authentication';
import CustomErrorText from '../../components/custom/custom.error.text.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

export interface ChangeCredentialPhoneNumberEnterPasswordComponentProps {
  navigation: {
    onBack: () => void;
    onNext: () => void;
  };
  wording: {
    title: string;
    desc: string;
  };
}

const useChangeCredentialPhoneNumberEnterPasswordSelector = (
  onSuccess: () => void,
) => {
  const { l10n } = useContext(LocalizationContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [passwordField, setPasswordField] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const [error, setError] =
    React.useState<Error | string | undefined>(undefined);

  const passwordRef = React.createRef<TextInput>();

  const onPasswordVisibilityChange = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onChangePasswordField = (password: string) => {
    if (error) {
      setError(undefined);
    }
    setPasswordField(password);
  };

  const onNext = async () => {
    setError(undefined);
    setIsLoading(true);

    try {
      await reauthenticateWithEmail(passwordField);
      onSuccess();
    } catch (e) {
      console.error(e);
      setError(parseFirebaseSignUpError(e, l10n));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    passwordField,
    error,
    isLoading,
    isPasswordVisible,
    passwordRef,
    onChangePasswordField,
    onPasswordVisibilityChange,
    onNext,
  };
};

export const ChangeCredentialPhoneNumberEnterPasswordComponent = (
  props: ChangeCredentialPhoneNumberEnterPasswordComponentProps,
) => {
  const { l10n } = useContext(LocalizationContext);
  const { navigation, wording } = props;

  const {
    passwordRef,
    passwordField,
    onChangePasswordField,
    onNext,
    onPasswordVisibilityChange,
    isLoading,
    isPasswordVisible,
    error,
  } = useChangeCredentialPhoneNumberEnterPasswordSelector(navigation.onNext);

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
          <View style={styles.space_s} />
          <InfoText style={styles.text80}>{wording.desc}</InfoText>
          <View style={styles.space_l} />
          <PasswordTextField
            value={passwordField}
            onChangeText={onChangePasswordField}
            style={styles.textField}
            secureTextEntry={!isPasswordVisible}
            placeholder={l10n.screens.PASSWORD}
            editable={!isLoading}
            visible={isPasswordVisible}
            visibilityOnPress={onPasswordVisibilityChange}
            ref={passwordRef}
            blurOnSubmit={false}
            returnKeyType={'next'}
          />
          <View style={styles.space_l} />
          {isLoading ? (
            <ActivityIndicator size={'small'} color={appColors.primary} />
          ) : (
            <CustomButton
              onPress={onNext}
              disabled={passwordField.length === 0}>
              {l10n.screens.NEXT}
            </CustomButton>
          )}
          <View style={styles.space_m} />
          {error && (
            <CustomErrorText
              style={styles.errorContainer}
              description={error !== typeof 'string' ? error.toString() : error}
            />
          )}
        </View>
        {!isLoading && (
          <AuthFooter title={l10n.screens.BACK} onPress={navigation.onBack} />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};
