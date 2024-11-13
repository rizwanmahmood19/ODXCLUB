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
  updatePhoneNumber,
} from '../../services/authentication';

import { SignUpPhoneContext } from '../auth/signup.phone.state';
import { AuthContext } from '../../states/auth.state';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

export interface ChangeCredentialPhoneNumberVerifyNewNumberComponentProps {
  navigation: {
    onBack: () => void;
    onNext: () => void;
  };
  wording: {
    title: string;
  };
}

const useChangeCredentialPhoneNumberVerifyNewNumberSelector = (
  onSuccess: () => void,
) => {
  const signUpPhoneContext = useContext(SignUpPhoneContext);
  const authContext = useContext(AuthContext);
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
      const vId = await createPhoneVerificationID(
        signUpPhoneContext.state.countryCallingCode.callingCode +
          signUpPhoneContext.state.number,
      );
      signUpPhoneContext.dispatch({
        type: 'setVerificationId',
        verificationId: vId,
      });
    } catch (e) {
      console.error(e);
      setError(parseFirebaseSignUpError(e, l10n));
    }
  };

  useEffect(() => {
    if (!signUpPhoneContext.state.verificationId) {
      newVerificationId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onVerify = async () => {
    if (!signUpPhoneContext.state.verificationId) {
      // most likely wrong phone number
      setError(l10n.error.auth.signUp.invalidVerificationCode);
      return;
    }
    if (!code) {
      setError(l10n.error.auth.signUp.operationNotAllowed);
      return;
    }
    setIsLoading(true);
    try {
      // update phone number with credentials
      await updatePhoneNumber(signUpPhoneContext.state.verificationId, code);

      // refresh the current user
      await currentUser()?.reload();
      authContext.dispatch({ type: 'setUser', user: currentUser() });

      // go back to settings
      onSuccess();
      setIsLoading(false);

      // reset reducer state
      signUpPhoneContext.dispatch({
        type: 'setVerificationId',
        verificationId: undefined,
      });
      signUpPhoneContext.dispatch({ type: 'setNumber', number: '' });
    } catch (e) {
      console.error(e);
      setError(parseFirebaseSignUpError(e, l10n));
      setIsLoading(false);
    }
  };

  const onResendCode = async () => {
    setError(undefined);
    await newVerificationId();
  };

  return {
    isLoading,
    error,
    code,
    isCodeComplete,
    onCodeChange,
    onResendCode,
    onVerify,
    number:
      signUpPhoneContext.state.countryCallingCode.callingCode +
      ' ' +
      signUpPhoneContext.state.number,
  };
};

export const ChangeCredentialPhoneNumberVerifyNewNumberComponent = (
  props: ChangeCredentialPhoneNumberVerifyNewNumberComponentProps,
) => {
  const { l10n } = useContext(LocalizationContext);
  const { dispatch } = useContext(SignUpMailContext);
  const { navigation, wording } = props;

  const {
    isLoading,
    error,
    isCodeComplete,
    onResendCode,
    onCodeChange,
    onVerify,
    number,
  } = useChangeCredentialPhoneNumberVerifyNewNumberSelector(navigation.onNext);

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
