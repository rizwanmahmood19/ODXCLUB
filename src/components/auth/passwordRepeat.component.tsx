import PasswordTextField from '../custom/password.text.field.component';
import styles from '../../scenes/auth/style';
import { View } from 'react-native-ui-lib';
import { ActivityIndicator, TextInput } from 'react-native';
import { appColors } from '../../style/appColors';
import CustomButton from '../custom/styleguide-components/custom.button.component';
import CustomErrorText from '../custom/custom.error.text.component';
import React, { useContext, useEffect } from 'react';
import { LocalizationContext } from '../../services/LocalizationContext';
import { isPasswordValid } from '../../services/validation';

export interface IPasswordRepeatComponentProps {
  isLoading: boolean;
  signUpError?: string | Error;
  initialPassword?: string;
  onPasswordSubmit: (password: string) => void;
}

export const PasswordRepeatComponent: React.FC<IPasswordRepeatComponentProps> =
  ({
    initialPassword = '',
    signUpError,
    isLoading,
    onPasswordSubmit,
  }: IPasswordRepeatComponentProps) => {
    const { l10n } = useContext(LocalizationContext);

    const [passwordField1, setPasswordField1] = React.useState(initialPassword);
    const [passwordField2, setPasswordField2] = React.useState(initialPassword);

    const [isPassword1Visible, setIsPassword1Visible] = React.useState(false);
    const [isPassword2Visible, setIsPassword2Visible] = React.useState(false);

    const password1Ref = React.createRef<TextInput>();
    const password2Ref = React.createRef<TextInput>();

    const [error, setError] = React.useState<Error | string | undefined>();

    useEffect(() => {
      setError(signUpError);
    }, [signUpError]);

    const resetError = () => {
      if (error) {
        setError(undefined);
      }
    };

    const onPassword1SubmitEditing = () => {
      if (password2Ref.current) {
        password2Ref.current.focus();
      }
    };

    const onPassword1VisibilityChange = () => {
      setIsPassword1Visible(!isPassword1Visible);
    };

    const onPassword2VisibilityChange = () => {
      setIsPassword2Visible(!isPassword2Visible);
    };

    const onChangePasswordField1 = (password: string) => {
      resetError();
      setPasswordField1(password);
    };

    const onChangePasswordField2 = (password: string) => {
      resetError();
      setPasswordField2(password);
    };

    const validate = (): boolean => {
      setError(undefined);

      if (passwordField1 !== passwordField2) {
        setError(l10n.error.auth.signUp.passwordsDoesNotMatch);
        return false;
      }

      if (!isPasswordValid(passwordField1)) {
        setError(l10n.error.auth.signUp.passwordInvalidPattern);
        return false;
      }
      return true;
    };

    return (
      <>
        <PasswordTextField
          value={passwordField1}
          onChangeText={onChangePasswordField1}
          style={styles.textField}
          secureTextEntry={!isPassword1Visible}
          placeholder={l10n.screens.PASSWORD}
          editable={!isLoading}
          visible={isPassword1Visible}
          visibilityOnPress={onPassword1VisibilityChange}
          ref={password1Ref}
          blurOnSubmit={false}
          onSubmitEditing={onPassword1SubmitEditing}
          returnKeyType={'next'}
          testID={'passwordField1'}
        />

        <View style={styles.space_m} />

        <PasswordTextField
          value={passwordField2}
          onChangeText={onChangePasswordField2}
          style={styles.textField}
          secureTextEntry={!isPassword2Visible}
          placeholder={l10n.screens.PASSWORD_REPEAT}
          editable={!isLoading}
          visible={isPassword2Visible}
          visibilityOnPress={onPassword2VisibilityChange}
          ref={password2Ref}
          testID={'passwordField2'}
        />

        <View style={styles.space_l} />

        {isLoading ? (
          <ActivityIndicator size="small" color={appColors.primary} />
        ) : (
          <CustomButton
            onPress={() => {
              if (validate()) {
                onPasswordSubmit(passwordField1);
              }
            }}
            testID={'passwordSubmitButton'}>
            {l10n.screens.SEND}
          </CustomButton>
        )}

        {error && (
          <CustomErrorText
            style={styles.errorSignUp}
            description={typeof error === 'string' ? error : error?.message}
          />
        )}
      </>
    );
  };
