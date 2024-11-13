import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';
import styles from '../auth/style';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import React, { useContext, useEffect, useState } from 'react';
import { LocalizationContext } from '../../services/LocalizationContext';
import { SignUpMailContext } from '../auth/signup.mail.state';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import CustomErrorText from '../../components/custom/custom.error.text.component';
import AuthFooter from '../../components/auth/auth.footer.component';
import { AuthCodeField } from '../../components/auth/auth.code.field.component';
import {
  createPhoneVerificationID,
  currentUser,
  parseFirebaseSignUpError,
  reauthenticateWithPhone,
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from '../../services/authentication';
import { AuthContext, ForcedSignOutReason } from '../../states/auth.state';
import { useSignOut } from '../auth/useSignOut';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

export interface ChangeCredentialMailVerifyCodeComponentProps {
  navigation: {
    onBack: () => void;
  };
}

const useChangeCredentialMailVerifyCodeSelector = () => {
  const { state, dispatch } = useContext(SignUpMailContext);
  const authContext = useContext(AuthContext);
  const { signOut } = useSignOut();

  const { l10n } = useContext(LocalizationContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | Error>();
  const [code, setCode] = useState<string>();
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const onCodeChange = (confirmationCode: string, isComplete: boolean) => {
    setCode(confirmationCode);
    setIsCodeComplete(isComplete);
  };
  const newVerificationId = async () => {
    try {
      const vId = await createPhoneVerificationID();
      dispatch({ type: 'setVerificationId', verificationId: vId });
    } catch (e) {
      setError(parseFirebaseSignUpError(e, l10n));
    }
  };

  const onResendCode = async () => {
    setError(undefined);
    await newVerificationId();
  };

  useEffect(() => {
    if (!state.verificationId) {
      newVerificationId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onVerify = async () => {
    if (!state.verificationId) {
      setError(l10n.error.auth.signUp.invalidVerificationCode);
      return;
    }
    if (!code) {
      setError(l10n.error.auth.signUp.operationNotAllowed);
      return;
    }
    setIsLoading(true);
    try {
      await reauthenticateWithPhone(state.verificationId, code);
      await updateEmail(state.email);
      await updatePassword(state.password);
      await sendEmailVerification();

      // force sign out
      await signOut();

      authContext.dispatch({
        type: 'setForcedSignOutReason',
        forcedSignOutReason: ForcedSignOutReason.addMail,
      });

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(parseFirebaseSignUpError(e, l10n));
      console.error(e);
    }
  };

  return {
    isLoading,
    error,
    code,
    isCodeComplete,
    onCodeChange,
    onVerify,
    onResendCode,
    number: currentUser()?.phoneNumber,
  };
};

export const ChangeCredentialMailVerifyCodeScreen = (
  props: ChangeCredentialMailVerifyCodeComponentProps,
) => {
  const { l10n } = useContext(LocalizationContext);
  const { dispatch } = useContext(SignUpMailContext);
  const { navigation } = props;

  const {
    isLoading,
    error,
    isCodeComplete,
    onCodeChange,
    onResendCode,
    onVerify,
    number,
  } = useChangeCredentialMailVerifyCodeSelector();

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
            {l10n.profile.settings.form.addMail}
          </Headline>
          <View style={styles.space_s} />
          <InfoText style={[styles.text80, specificStyle.matt]}>
            {number ? number : ''}
          </InfoText>
          <CustomButton type="link" onPress={onResendCode} disabled={isLoading}>
            <InfoText style={[styles.link, styles.primaryColor]}>
              {l10n.screens.SIGN_UP_PHONE_ENTER_CODE_RESEND}
            </InfoText>
          </CustomButton>
          <View style={styles.space_s} />
          <InfoText style={styles.text80}>
            {l10n.screens.SIGN_UP_PHONE_ENTER_CODE_DESCRIPTION}
          </InfoText>
          {error && (
            <>
              <View style={styles.space_l} />
              <CustomErrorText
                style={specificStyle.error}
                description={
                  error !== typeof 'string' ? error.toString() : error
                }
              />
            </>
          )}
          <View style={specificStyle.codeContainer}>
            <AuthCodeField
              onChange={onCodeChange}
              cellTextStyle={{
                color: error ? appColors.secondary : appColors.mainTextColor,
              }}
              cellRootStyle={{
                borderBottomColor: error
                  ? appColors.secondary
                  : appColors.primary,
              }}
            />
          </View>
          <View style={styles.space_l} />
          {isLoading ? (
            <ActivityIndicator size={'small'} color={appColors.primary} />
          ) : (
            <CustomButton onPress={onVerify} disabled={!isCodeComplete}>
              {l10n.screens.NEXT}
            </CustomButton>
          )}
        </View>
        <AuthFooter
          title={l10n.screens.BACK}
          onPress={() => {
            navigation.onBack();
            dispatch({ type: 'setVerificationId', verificationId: undefined });
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const specificStyle = StyleSheet.create({
  codeContainer: { marginTop: 16, width: '60%' },
  error: { width: '80%' },
  matt: { color: appColors.mediumGrey },
});
