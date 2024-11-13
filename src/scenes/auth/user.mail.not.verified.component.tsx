import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';
import { LocalizationContext } from '../../services/LocalizationContext';

import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import { useUserMailNotVerifiedSelector } from './user.mail.not.verified.selector';

import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';

import styles from './style';
import { appColors } from '../../style/appColors';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import CustomErrorText from '../../components/custom/custom.error.text.component';
import StepNumber from '../../components/auth/step.number.component';
import { AuthContext } from '../../states/auth.state';

const UserMailNotVerified = () => {
  const { l10n } = useContext(LocalizationContext);
  const { state } = useContext(AuthContext);
  const { onGoToLogin, isLoading, error, onResendVerificationEmail } =
    useUserMailNotVerifiedSelector();
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
            {l10n.signUp.emailVerification.title}
          </Headline>
          <View style={styles.space_m} />
          <InfoText style={specificStyles.email}>
            {state.user?.email || ''}
          </InfoText>
          <View style={styles.space_m} />
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <StepNumber number={step} />
              <View style={styles.space_m} />
              <InfoText style={styles.text80}>
                {l10n.signUp.emailVerification.description.steps[step]}
              </InfoText>
              <View style={styles.space_m} />
            </React.Fragment>
          ))}
          <CustomButton
            type="link"
            onPress={onResendVerificationEmail}
            disabled={isLoading}>
            <InfoText style={[styles.link, styles.primaryColor]}>
              {l10n.screens.SIGN_UP_EMAIL_VERIFICATION_RESEND}
            </InfoText>
          </CustomButton>
          {error && (
            <CustomErrorText style={styles.errorSignUp} description={error} />
          )}
          <View style={styles.space_s} />
          {isLoading ? (
            <ActivityIndicator size="small" color={appColors.primary} />
          ) : (
            <CustomButton onPress={onGoToLogin}>
              {l10n.screens.SIGN_IN_EMAIL_LINK}
            </CustomButton>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const specificStyles = StyleSheet.create({
  email: {
    color: appColors.darkGrey,
    fontSize: 18,
    lineHeight: 22,
  },
});

export default UserMailNotVerified;
