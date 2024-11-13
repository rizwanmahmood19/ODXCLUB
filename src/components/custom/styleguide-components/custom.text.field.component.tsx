import React, { forwardRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { View } from 'react-native-ui-lib';
import { TextFieldProps } from 'react-native-ui-lib/typings';
import { appColors } from '../../../style/appColors';
import { appFont } from '../../../style/appFont';
import Label from './label.component';
import { textInputStyles } from '../../../style/appStyle';

export interface CustomTextFieldProps extends TextFieldProps {
  style?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;
}

const CustomTextField = forwardRef<TextInput, CustomTextFieldProps>(
  (props, ref) => {
    const { style, label, labelStyle } = props;

    return (
      <View>
        {label && <Label style={[styles.label, labelStyle]}>{label}</Label>}
        <TextInput
          {...props}
          style={[styles.textField, style]}
          autoCapitalize="none"
          autoCorrect={false}
          ref={ref}
          maxFontSizeMultiplier={2}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  label: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    paddingBottom: 9,
  },
  textField: {
    ...textInputStyles,
    backgroundColor: 'white',
    borderColor: appColors.primary,
    borderRadius: 50,
    borderWidth: 2,
    color: appColors.mainTextColor,
    height: 38,
    paddingHorizontal: 18,
    paddingVertical: 0,
    width: '100%',
  },
});

export default CustomTextField;
