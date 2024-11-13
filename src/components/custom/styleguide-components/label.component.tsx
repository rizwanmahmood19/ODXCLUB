import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { appFont } from '../../../style/appFont';
import { appColors } from '../../../style/appColors';

interface LabelProps {
  children: string;
  style?: StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;
}

const Label = (props: LabelProps) => {
  const { children, style } = props;

  return (
    <Text style={[styles.label, style]} maxFontSizeMultiplier={2}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default Label;
