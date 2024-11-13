import React, { useContext } from 'react';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';
import { LocalizationContext } from '../../services/LocalizationContext';
import styles from './style';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import AuthFooter from '../../components/auth/auth.footer.component';
import useSignUpPhoneEnterCodeSelector from './signup.phone.enter.code.selector';

import { AuthCodeField } from '../../components/auth/auth.code.field.component';
import { appColors } from '../../style/appColors';
import { ActivityIndicator, StyleSheet } from 'react-native';
import CustomErrorText from '../../components/custom/custom.error.text.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

export interface SignUpPhoneEnterCodeScreenProps {
  navigation: {
    backOnPress: () => void;
  };
  isLogin: boolean;
}

export const SignUpPhoneEnterCodeScreen = (
  props: SignUpPhoneEnterCodeScreenProps,
) => {
  const { l10n } = useContext(LocalizationContext);
  const { navigation, isLogin } = props;

  const { number, error, isLoading, onChange, onSend, onResendCode } =
    useSignUpPhoneEnterCodeSelector({ isLogin });

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
            {isLogin ? l10n.screens.SIGN_IN_PHONE : l10n.screens.SIGN_UP_PHONE}
          </Headline>
          <View style={styles.space_s} />
          <InfoText style={[styles.text80, specificStyle.phoneNumber]}>
            {number}
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
                description={error}
              />
            </>
          )}
          <View style={specificStyle.codeContainer}>
            <AuthCodeField
              onChange={onChange}
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
            <CustomButton onPress={onSend}>{l10n.screens.SEND}</CustomButton>
          )}
        </View>
        <AuthFooter
          title={l10n.screens.BACK}
          onPress={navigation.backOnPress}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const specificStyle = StyleSheet.create({
  codeContainer: { marginTop: 16, width: '80%' },
  error: { width: '80%' },
  phoneNumber: { color: appColors.mediumGrey, fontSize: 16 },
});
