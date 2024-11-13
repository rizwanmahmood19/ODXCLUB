import React, { useContext } from 'react';
import { ActivityIndicator } from 'react-native';

import { KeyboardAwareScrollView, Text, View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';

import AuthFooter from '../../components/auth/auth.footer.component';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import useSignInMailSelector from './signin.mail.selector.component';
import PasswordTextField from '../../components/custom/password.text.field.component';
import EmailTextField from '../../components/custom/email.text.field.component';

import { appColors } from '../../style/appColors';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import styles from './style';
import CustomErrorText from '../../components/custom/custom.error.text.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

export interface SignInMailScreenProps {
  forgotPasswordLogin: boolean;
  navigation: {
    footerButtonOnPress: () => void;
    forgotPasswordOnPress: () => void;
  };
}

export const SignInMailScreen = (props: SignInMailScreenProps) => {
  const { l10n } = useContext(LocalizationContext);
  const { forgotPasswordLogin, navigation } = props;
  const {
    email,
    password,
    error,
    isLoading,
    isSigInButtonEnabled,
    isPasswordVisible,
    emailRef,
    passwordRef,
    onLogin,
    onChangeEmail,
    onChangePassword,
    onPasswordVisibilityChange,
    onEmailSubmitEditing,
  } = useSignInMailSelector();

  return (
    <View flex useSafeArea={true} style={styles.screen}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always">
        <View style={styles.content}>
          <LogoIcon
            width={styles.logo.width}
            height={styles.logo.height}
            style={styles.logo}
          />
          <View style={styles.space_s} />
          <Headline type="h1" style={styles.text80}>
            {forgotPasswordLogin
              ? l10n.auth.forgotPassword.loginTitle
              : l10n.screens.SIGN_IN_EMAIL}
          </Headline>
          <View style={styles.space_s} />
          <InfoText style={styles.text80}>
            {forgotPasswordLogin
              ? l10n.auth.forgotPassword.loginDescription
              : l10n.screens.SIGN_IN_DESCRIPTION}
          </InfoText>
          <View style={styles.space_l} />
          <EmailTextField
            testID={'emailField'}
            value={email}
            onChangeText={onChangeEmail}
            style={styles.textField}
            placeholder={l10n.screens.EMAIL_PLACEHOLDER}
            editable={!isLoading}
            ref={emailRef}
            onSubmitEditing={onEmailSubmitEditing}
            blurOnSubmit={false}
            returnKeyType={'next'}
          />
          <View style={styles.space_m} />
          <PasswordTextField
            testID={'passwordField'}
            value={password}
            onChangeText={onChangePassword}
            style={styles.textField}
            secureTextEntry={!isPasswordVisible}
            placeholder={l10n.screens.PASSWORD}
            editable={!isLoading}
            visible={isPasswordVisible}
            visibilityOnPress={onPasswordVisibilityChange}
            ref={passwordRef}
          />
          <View style={styles.space_l} />
          {isLoading ? (
            <ActivityIndicator size="small" color={appColors.primary} />
          ) : (
            <CustomButton
              testID={'submitButton'}
              onPress={onLogin}
              disabled={!isSigInButtonEnabled}>
              {l10n.screens.SIGN_IN_TITLE}
            </CustomButton>
          )}
          <View style={styles.space_l} />
          <CustomButton
            type="link"
            testID="signUpTouchable"
            style={styles.textField}
            onPress={navigation.forgotPasswordOnPress}>
            <Text style={[styles.link, styles.primaryColor]}>
              {l10n.auth.forgotPassword.general}
            </Text>
          </CustomButton>
          {error && (
            <CustomErrorText
              style={styles.errorSignIn}
              description={typeof error === 'string' ? error : error?.message}
            />
          )}
        </View>
        <AuthFooter
          testID="footerTouchable"
          title={l10n.screens.BACK}
          onPress={navigation.footerButtonOnPress}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
