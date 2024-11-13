import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-ui-lib';

import { appFont } from '../../../style/appFont';
import { appColors } from '../../../style/appColors';

interface TextLinkProps {
  children: string;
  style?: StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;
}

const TextLink = (props: TextLinkProps) => {
  const { children, style } = props;

  return (
    <Text style={[styles.textLink, style]} maxFontSizeMultiplier={2}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textLink: {
    color: appColors.mainTextColor,
    fontFamily: appFont.medium,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default TextLink;
