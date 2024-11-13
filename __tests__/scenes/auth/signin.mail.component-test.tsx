import React from 'react';
import { SignInMailScreen } from '../../../src/scenes/auth/signin.mail.component';
import { render, fireEvent } from '@testing-library/react-native';
import { appColors } from '../../../src/style/appColors';

describe('SignInMailScreen Component Test', () => {
  const mockOnForgotPasswordOnPress = jest.fn();
  const mockOnFooterButtonOnPress = jest.fn();

  const enabledButtonStyle = { backgroundColor: appColors.primary };
  const disabledButtonStyle = { backgroundColor: appColors.primaryLight };

  it('checks that the correct navigation callbacks are triggered on press', () => {
    const component = render(
      <SignInMailScreen
        forgotPasswordLogin={false}
        navigation={{
          footerButtonOnPress: mockOnFooterButtonOnPress,
          forgotPasswordOnPress: mockOnForgotPasswordOnPress,
        }}
      />,
    );

    fireEvent.press(component.getByTestId('signUpTouchable'));
    expect(mockOnForgotPasswordOnPress).toHaveBeenCalled();

    fireEvent.press(component.getByTestId('footerTouchable'));
    expect(mockOnFooterButtonOnPress).toHaveBeenCalled();
  });

  it('checks the enabled/disabled state for submit button', () => {
    const component = render(
      <SignInMailScreen
        forgotPasswordLogin={false}
        navigation={{
          footerButtonOnPress: mockOnFooterButtonOnPress,
          forgotPasswordOnPress: mockOnForgotPasswordOnPress,
        }}
      />,
    );

    const submitButton = component.getByTestId('submitButton');
    // empty input field => expect disabled submit button
    expect(submitButton.props.style).toMatchObject(disabledButtonStyle);
    // enter valid email => expect disabled submit button
    fireEvent.changeText(component.getByTestId('emailField'), 'user@mail.de');
    expect(submitButton.props.style).toMatchObject(disabledButtonStyle);
    // enter one character => expect enabled submit button
    fireEvent.changeText(component.getByTestId('passwordField'), '+');
    expect(submitButton.props.style).toMatchObject(enabledButtonStyle);
  });
});
