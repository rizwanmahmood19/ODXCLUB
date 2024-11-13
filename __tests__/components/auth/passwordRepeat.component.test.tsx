import { ReactTestInstance } from 'react-test-renderer';

jest.mock('react-native-reanimated', () =>
  jest.requireActual('../../../node_modules/react-native-reanimated/mock'),
);

jest.mock('react-native-reanimated', () =>
  jest.requireActual('../../../node_modules/react-native-reanimated/mock'),
);

import {
  IPasswordRepeatComponentProps,
  PasswordRepeatComponent,
} from '../../../src/components/auth/passwordRepeat.component';
import { fireEvent, render, RenderAPI } from '@testing-library/react-native';
import LocalizedStrings from 'react-native-localization';
import { localization } from '@match-app/shared';
import React from 'react';

describe('PasswordRepeatComponent', () => {
  let defaultProps: IPasswordRepeatComponentProps;
  let component: RenderAPI;
  let passwordField1: ReactTestInstance;
  let passwordField2: ReactTestInstance;
  let submitButton: ReactTestInstance;

  beforeEach(() => {
    defaultProps = {
      isLoading: false,
      initialPassword: '',
      onPasswordSubmit: jest.fn(),
    };
    component = render(<PasswordRepeatComponent {...defaultProps} />);
    passwordField1 = component.getByTestId('passwordField1');
    passwordField2 = component.getByTestId('passwordField2');
    submitButton = component.getByTestId('passwordSubmitButton');
  });

  describe('Correctly interacting with properties', () => {
    it('should emit the password when two matching passwords are entered', () => {
      fireEvent.changeText(passwordField1, 'myPassword123');
      fireEvent.changeText(passwordField2, 'myPassword123');
      fireEvent.press(submitButton);

      expect(defaultProps.onPasswordSubmit).toHaveBeenCalledWith(
        'myPassword123',
      );
    });

    it('should apply the default password', async () => {
      defaultProps.initialPassword = 'initialPassword';
      component = render(<PasswordRepeatComponent {...defaultProps} />);
      passwordField1 = await component.getByTestId('passwordField1');
      expect(passwordField1.props.value).toEqual('initialPassword');
      passwordField2 = await component.getByTestId('passwordField2');
      expect(passwordField2.props.value).toEqual('initialPassword');
    });

    it('should display the initial error', async () => {
      defaultProps.signUpError = 'initialError';
      component = render(<PasswordRepeatComponent {...defaultProps} />);

      const errorText = await component.findByTestId('errorText');
      expect(errorText.children[0]).toEqual('initialError');
    });
  });

  describe('handling bad input', () => {
    it('should display an error if the passwords do not match', async () => {
      fireEvent.changeText(passwordField1, 'myPassword123');
      fireEvent.changeText(passwordField2, 'anotherPassword');
      fireEvent.press(submitButton);
      expect(defaultProps.onPasswordSubmit).not.toHaveBeenCalled();

      const translations = new LocalizedStrings(localization);
      const errorText = await component.findByTestId('errorText');
      expect(errorText.children[0]).toEqual(
        translations.error.auth.signUp.passwordsDoesNotMatch,
      );
    });

    it('should display an error if the password is not strong enough', async () => {
      fireEvent.changeText(passwordField1, 'abc');
      fireEvent.changeText(passwordField2, 'abc');
      fireEvent.press(submitButton);
      expect(defaultProps.onPasswordSubmit).not.toHaveBeenCalled();

      const translations = new LocalizedStrings(localization);
      const errorText = await component.findByTestId('errorText');
      expect(errorText.children[0]).toEqual(
        translations.error.auth.signUp.passwordInvalidPattern,
      );
    });
  });
});
