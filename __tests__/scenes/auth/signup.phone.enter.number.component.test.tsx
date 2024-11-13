import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { SignUpPhoneEnterNumberScreen } from '../../../src/scenes/auth';
import LocalizedStrings from 'react-native-localization';
import { localization } from '@match-app/shared';

import {
  countriesOnTop,
  otherSupportedCountries,
} from '../../../src/util/phone.authentication.supported.countries';

jest.mock('react-native-reanimated', () =>
  jest.requireActual('../../../node_modules/react-native-reanimated/mock'),
);

jest.mock('@react-native-community/picker', () => {
  class Picker extends React.Component {
    static Item = (props: { children: never }) => {
      return React.createElement('Item', props, props.children);
    };

    render() {
      return React.createElement('Picker', this.props, this.props.children);
    }
  }

  return {
    Picker,
  };
});

describe('SignUpPhoneEnterNumberScreen Test', () => {
  const mockPressSend = jest.fn();
  const mockPressBack = jest.fn();

  it('Calls backOnPress on auth footer press', () => {
    const { getByTestId } = render(
      <SignUpPhoneEnterNumberScreen
        isLogin={false}
        navigation={{
          sendOnPress: mockPressSend,
          backOnPress: mockPressBack,
        }}
      />,
    );

    fireEvent.press(getByTestId('authFooter'));
    expect(mockPressBack).toHaveBeenCalled();
  });

  it('Correctly loads Login texts according to props', () => {
    const { queryByText } = render(
      <SignUpPhoneEnterNumberScreen
        isLogin={true}
        navigation={{
          sendOnPress: mockPressSend,
          backOnPress: mockPressBack,
        }}
      />,
    );

    const l10n = new LocalizedStrings(localization);
    const signInTitle = queryByText(l10n.screens.SIGN_IN_PHONE);
    const signUpTitle = queryByText(l10n.screens.SIGN_UP_PHONE);
    const secondHint = queryByText(
      l10n.screens.SIGN_UP_PHONE_ENTER_NUMBER_SECOND_HINT,
    );

    expect(signInTitle).toBeTruthy();
    expect(signUpTitle).toBeFalsy();
    expect(secondHint).toBeFalsy();
  });

  it('Correctly load Sign up texts according to props', () => {
    const { queryByText } = render(
      <SignUpPhoneEnterNumberScreen
        isLogin={false}
        navigation={{
          sendOnPress: mockPressSend,
          backOnPress: mockPressBack,
        }}
      />,
    );

    const l10n = new LocalizedStrings(localization);
    const signInTitle = queryByText(l10n.screens.SIGN_IN_PHONE);
    const signUpTitle = queryByText(l10n.screens.SIGN_UP_PHONE);
    const secondHint = queryByText(
      l10n.screens.SIGN_UP_PHONE_ENTER_NUMBER_SECOND_HINT,
    );

    expect(signInTitle).toBeFalsy();
    expect(signUpTitle).toBeTruthy();
    expect(secondHint).toBeTruthy();
  });

  describe('Checks that all countryCodes have a correct translation in EN and DE languages', () => {
    const deCountryNames: Map<string, string> = new Map(
      Object.entries(localization.de.countryNames),
    );
    const enCountryNames: Map<string, string> = new Map(
      Object.entries(localization.en.countryNames),
    );

    for (let i = 0; i < countriesOnTop.length; i++) {
      const countryCode = countriesOnTop[i].country;
      expect(deCountryNames.has(countryCode)).toBeTruthy();
      expect(enCountryNames.has(countryCode)).toBeTruthy();
    }

    for (let i = 0; i < otherSupportedCountries.length; i++) {
      const countryCode = otherSupportedCountries[i].country;
      expect(deCountryNames.has(countryCode)).toBeTruthy();
      expect(enCountryNames.has(countryCode)).toBeTruthy();
    }
  });
});
