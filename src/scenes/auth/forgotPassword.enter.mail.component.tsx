import React, { useContext } from 'react';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import AuthFooter from '../../components/auth/auth.footer.component';
import styles from './style';

import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import EmailTextField from '../../components/custom/email.text.field.component';
import useForgotPasswordEnterMailSelector from './forgotPassword.enter.selector';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import { appColors } from '../../style/appColors';
import { ActivityIndicator } from 'react-native';
import CustomErrorText from '../../components/custom/custom.error.text.component';
import { parseFirebaseSignUpError } from '../../services/authentication';

export interface ForgotPasswordEnterMailScreenProps {
  navigation: {
    backButtonOnPress: () => void;
    onSendPasswordResetEmailSuccess: () => void;
  };
}

export const ForgotPasswordEnterMailScreen = (
  props: ForgotPasswordEnterMailScreenProps,
) => {
  const {
    email,
    isEmailValid,
    onEmailChange,
    onForgotPassword,
    isLoading,
    error,
  } = useForgotPasswordEnterMailSelector({
    onSendPasswordResetEmailSuccess:
      props.navigation.onSendPasswordResetEmailSuccess,
  });
  const { l10n } = useContext(LocalizationContext);
  const { navigation } = props;

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
            {l10n.auth.forgotPassword.general}
          </Headline>
          <View style={styles.space_s} />
          <InfoText style={styles.text80}>
            {l10n.auth.forgotPassword.description}
          </InfoText>
          <View style={styles.space_l} />
          <EmailTextField
            value={email}
            onChangeText={onEmailChange}
            style={styles.textField}
            placeholder={l10n.screens.EMAIL_PLACEHOLDER}
            editable={true}
          />
          <View style={styles.space_l} />
          {isLoading ? (
            <ActivityIndicator color={appColors.primary} size="small" />
          ) : (
            <CustomButton onPress={onForgotPassword} disabled={!isEmailValid}>
              {l10n.auth.forgotPassword.general}
            </CustomButton>
          )}
          <View style={styles.space_l} />
          {error && (
            <CustomErrorText
              style={styles.errorSignUp}
              description={parseFirebaseSignUpError(error!, l10n)}
            />
          )}
        </View>
        <AuthFooter
          title={l10n.screens.BACK}
          onPress={navigation.backButtonOnPress}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
