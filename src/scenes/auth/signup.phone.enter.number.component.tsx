import React, { useContext } from 'react';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';
import { LocalizationContext } from '../../services/LocalizationContext';
import styles from './style';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import AuthFooter from '../../components/auth/auth.footer.component';
import PhoneNumberTextField from '../../components/custom/phone.number.text.field.component';
import { appColors } from '../../style/appColors';
import useSignUpPhoneEnterNumberSelector from './signup.phone.enter.number.selector';
import { ActivityIndicator, StyleSheet } from 'react-native';
import CustomErrorText from '../../components/custom/custom.error.text.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import PhoneCountryCodesPicker from '../../components/auth/phone.country.codes.picker.component';

export interface SignUpPhoneEnterNumberScreenProps {
  navigation: {
    sendOnPress: () => void;
    backOnPress: () => void;
  };
  isLogin: boolean;
}

export const SignUpPhoneEnterNumberScreen = (
  props: SignUpPhoneEnterNumberScreenProps,
) => {
  const { l10n } = useContext(LocalizationContext);

  const { navigation, isLogin } = props;
  const {
    isSendEnabled,
    isLoading,
    onNumberChange,
    onCallingCodeChange,
    onSendPress,
    countryCallingCode,
    number,
    error,
  } = useSignUpPhoneEnterNumberSelector({
    onSendSuccess: navigation.sendOnPress,
    isLogin,
  });
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
          <InfoText style={styles.text80}>
            {isLogin
              ? l10n.screens.SIGN_IN_PHONE_ENTER_NUMBER
              : l10n.screens.SIGN_UP_PHONE_ENTER_NUMBER}
          </InfoText>
          <View style={styles.space_l} />
          <View style={specificStyle.inputContainer}>
            <View style={specificStyle.pickerContainer}>
              <PhoneCountryCodesPicker
                value={countryCallingCode}
                onCallingCodeChange={onCallingCodeChange}
              />
            </View>
            <PhoneNumberTextField
              testID="phoneNumberTextField"
              placeholder={'000 0000'}
              style={specificStyle.numberField}
              value={number}
              onChangeText={onNumberChange}
            />
          </View>
          <View style={styles.space_l} />
          <InfoText style={styles.text80left}>
            {l10n.screens.SIGN_UP_PHONE_ENTER_NUMBER_HINT}
          </InfoText>
          <View style={styles.space_m} />
          {!isLogin && (
            <InfoText style={[styles.text80left, styles.primaryColor]}>
              {l10n.screens.SIGN_UP_PHONE_ENTER_NUMBER_SECOND_HINT}
            </InfoText>
          )}
          <View style={styles.space_l} />
          {isLoading ? (
            <ActivityIndicator size={'small'} color={appColors.primary} />
          ) : (
            <CustomButton
              testID="sendButton"
              onPress={onSendPress}
              disabled={!isSendEnabled}>
              {l10n.screens.SEND}
            </CustomButton>
          )}
          <View style={styles.space_m} />
          {error && (
            <CustomErrorText style={specificStyle.error} description={error} />
          )}
        </View>
        <AuthFooter
          testID="authFooter"
          title={l10n.screens.BACK}
          onPress={navigation.backOnPress}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const specificStyle = StyleSheet.create({
  error: {
    width: '80%',
  },
  inputContainer: { flexDirection: 'row', width: '80%' },
  numberField: {
    flex: 1,
  },
  pickerContainer: {
    marginRight: 12,
    width: 100,
  },
});
