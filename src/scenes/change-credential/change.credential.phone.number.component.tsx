import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';
import styles from '../auth/style';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import { CountryCallingCode } from '../../util/phone.authentication.supported.countries';
import PhoneNumberTextField from '../../components/custom/phone.number.text.field.component';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import AuthFooter from '../../components/auth/auth.footer.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { SignUpPhoneContext } from '../auth/signup.phone.state';
import { isPhoneNumberValid } from '../../services/validation';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import { PickerItemValue } from 'react-native-ui-lib/typings';
import PhoneCountryCodesPicker from '../../components/auth/phone.country.codes.picker.component';

export interface ChangeCredentialPhoneNumberScreenProps {
  navigation: {
    onBack: () => void;
    onNext: () => void;
  };
  wording: { title: string };
}

const useEnterPhoneNumberSelector = () => {
  const { dispatch, state } = useContext(SignUpPhoneContext);

  const onNumberChange = (number: string) => {
    dispatch({ type: 'setNumber', number: number });
  };

  const onCallingCodeChange = (item: PickerItemValue) => {
    dispatch({
      type: 'setCountryCallingCode',
      countryCallingCode: (item as { label: string; value: CountryCallingCode })
        ?.value,
    });
  };

  return {
    number: state.number,
    countryCallingCode: state.countryCallingCode,
    isSubmitEnabled: isPhoneNumberValid(
      state.countryCallingCode.callingCode + state.number,
    ),
    onNumberChange,
    onCallingCodeChange,
  };
};

export const ChangeCredentialPhoneNumberScreen = (
  props: ChangeCredentialPhoneNumberScreenProps,
) => {
  const { navigation, wording } = props;
  const { l10n } = useContext(LocalizationContext);

  const {
    countryCallingCode,
    onCallingCodeChange,
    onNumberChange,
    isSubmitEnabled,
    number,
  } = useEnterPhoneNumberSelector();
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
          <InfoText style={styles.text80}>
            {l10n.screens.SIGN_UP_PHONE_ENTER_NUMBER}
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
              placeholder={'000 000 000'}
              style={specificStyle.numberField}
              value={number}
              onChangeText={onNumberChange}
            />
          </View>
          <View style={styles.space_l} />
          <InfoText style={styles.text80}>
            {l10n.screens.SIGN_UP_PHONE_ENTER_NUMBER_HINT}
          </InfoText>
          <View style={styles.space_l} />
          <CustomButton onPress={navigation.onNext} disabled={!isSubmitEnabled}>
            {l10n.screens.NEXT}
          </CustomButton>
          <View style={styles.space_m} />
        </View>
        <AuthFooter title={l10n.screens.BACK} onPress={navigation.onBack} />
      </KeyboardAwareScrollView>
    </View>
  );
};

const specificStyle = StyleSheet.create({
  inputContainer: { flexDirection: 'row', width: '80%' },
  numberField: {
    flex: 1,
  },
  pickerContainer: {
    marginRight: 12,
    width: 110,
  },
});
