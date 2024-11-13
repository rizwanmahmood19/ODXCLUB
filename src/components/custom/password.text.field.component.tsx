import React, { forwardRef } from 'react';
import { Assets, Image, TouchableOpacity } from 'react-native-ui-lib';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { appColors } from '../../style/appColors';
import { textInputStyles } from '../../style/appStyle';
import { is_android } from '../../util/osCheck';

export interface PasswordTextFieldProps extends TextInputProps {
  visible: boolean;
  value: string;
  visibilityOnPress?: () => void;
  secureTextEntry: boolean;
}

const IMAGE_WIDTH = 18;
const IMAGE_HEIGHT = 15;

const PasswordTextField = forwardRef((props: PasswordTextFieldProps, ref?) => {
  const { visible, value, visibilityOnPress, secureTextEntry } = props;

  // Quickfix to have android showing the placeholder with the correct font
  // It changes to an incorrect font if you change visibility
  // And the fix breaks the input field, if applied to iOS
  const evaluatedSecureTextEntry = is_android
    ? secureTextEntry && value.length !== 0
    : secureTextEntry;

  return (
    <View style={[props.style, styles.container]}>
      <TextInput
        {...props}
        secureTextEntry={evaluatedSecureTextEntry}
        blurOnSubmit={false}
        onSubmitEditing={() => Keyboard.dismiss()}
        style={styles.textField}
        ref={ref as any}
        maxFontSizeMultiplier={2}
      />
      <TouchableOpacity onPress={visibilityOnPress}>
        <Image
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          style={styles.image}
          resizeMode="contain"
          source={
            visible
              ? Assets.icons.passwordInVisibility
              : Assets.icons.passwordVisibility
          }
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: appColors.primary,
    borderRadius: 50,
    borderWidth: 2,
    flexDirection: 'row',
    height: 38,
    paddingLeft: 8,
    width: '80%',
  },
  image: {
    height: IMAGE_HEIGHT,
    marginHorizontal: 12,
    width: IMAGE_WIDTH,
  },
  textField: {
    ...textInputStyles,
    backgroundColor: 'white',
    borderWidth: 0,
    color: appColors.mainTextColor,
    flex: 1,
    margin: 0,
    padding: 0,
    paddingHorizontal: 18,
  },
});

export default PasswordTextField;
