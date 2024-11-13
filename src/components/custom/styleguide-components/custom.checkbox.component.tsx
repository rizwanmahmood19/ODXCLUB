import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Checkbox, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { appFont } from '../../../style/appFont';

interface CustomCheckboxProps {
  value: boolean;
  label?: string;
  children?: ReactNode;
  onValueChange: () => void;
}

const CustomCheckbox = (props: CustomCheckboxProps) => {
  const { value, label, children, onValueChange } = props;

  return (
    <View style={styles.checkboxContainer}>
      <Checkbox
        style={styles.checkbox}
        value={value}
        onValueChange={onValueChange}
      />
      <TouchableOpacity activeOpacity={0.8} onPress={onValueChange}>
        {label ? (
          <Text style={styles.checkboxText} maxFontSizeMultiplier={2}>
            {label}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderRadius: 3,
  },
  checkboxContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  checkboxText: {
    fontFamily: appFont.medium,
    fontSize: 14,
    paddingLeft: 10,
  },
});

export default CustomCheckbox;
