import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { TextFieldProps } from 'react-native-ui-lib/typings';

import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import { textInputStyles } from '../../style/appStyle';

export interface CustomTextAreaProps extends TextFieldProps {
  value: string;
  label?: string;
  labelStyle?: Record<string, unknown>;
  showCount?: boolean;
  enabled?: boolean;
  autocompleteType?: string;
  style?: Record<string, unknown>;
}

const CustomTextArea = (props: CustomTextAreaProps) => {
  const {
    value,
    label,
    labelStyle,
    style,
    maxLength,
    showCount,
    ...otherProps
  } = props;

  return (
    <View>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[styles.textArea, style]}
        value={value}
        enableErrors={false}
        hideUnderline={true}
        autoCapitalize="none"
        autoCorrect={false}
        multiline={true}
        blurOnSubmit={true}
        maxLength={maxLength}
        maxFontSizeMultiplier={2}
        {...otherProps}
      />
      {showCount && maxLength ? (
        <Text style={styles.counter} maxFontSizeMultiplier={1}>
          {maxLength - value.length}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  counter: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    bottom: 3,
    fontSize: 10,
    position: 'absolute',
    right: 10,
  },
  label: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    paddingBottom: 10,
  },
  textArea: {
    ...textInputStyles,
    borderColor: appColors.primary,
    borderRadius: 15,
    borderWidth: 2,
    height: 130,
    paddingBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
});

export default CustomTextArea;
