import React, { useContext, useMemo } from 'react';
import {
  CountryCallingCode,
  countriesOnTop,
  otherSupportedCountries,
} from '../../util/phone.authentication.supported.countries';
import CustomPicker from '../custom/styleguide-components/custom.picker.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { StyleSheet } from 'react-native';
import { Picker } from 'react-native-ui-lib';
import { PickerItemValue } from 'react-native-ui-lib/typings';

interface PhoneCountryCodesPickerProps {
  value: CountryCallingCode;
  onCallingCodeChange: (item: PickerItemValue) => void;
}

const PhoneCountryCodesPicker = (props: PhoneCountryCodesPickerProps) => {
  const { value, onCallingCodeChange } = props;
  const { l10n } = useContext(LocalizationContext);

  // Get country names and sort them alphabetically, adding the countries to be on top before
  const countryCodes = useMemo(() => {
    const translatedCountriesOnTop = countriesOnTop.map((countryInfo) => ({
      ...countryInfo,
      name: l10n.countryNames[countryInfo.country],
    }));

    const orderedTranslatedOtherCountries = otherSupportedCountries
      .map((countryInfo) => ({
        ...countryInfo,
        name: l10n.countryNames[countryInfo.country],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return [...translatedCountriesOnTop, ...orderedTranslatedOtherCountries];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CustomPicker
      style={styles.picker}
      value={{
        label: value.callingCode,
        value: value,
      }}
      onChange={onCallingCodeChange}>
      {countryCodes.map((countryCode) => (
        <Picker.Item
          key={countryCode.country}
          value={{
            value: countryCode,
            label: `${countryCode.callingCode}${new Array(
              20 - countryCode.callingCode.length * 2,
            ).join(' ')}${countryCode.name}`,
          }}
        />
      ))}
    </CustomPicker>
  );
};

const styles = StyleSheet.create({
  picker: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PhoneCountryCodesPicker;
