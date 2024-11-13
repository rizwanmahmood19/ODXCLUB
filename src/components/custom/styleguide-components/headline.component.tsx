/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-ui-lib';

import { appFont } from '../../../style/appFont';
import { appColors } from '../../../style/appColors';

interface HeadlineProps {
  children: string;
  type: 'h1' | 'h2' | 'h3';
  numberOfLines?: number;
  isCentered?: boolean;
  style?: StyleProp<TextStyle>;
}

const Headline = ({
  numberOfLines,
  children,
  type,
  style,
  isCentered = false,
}: HeadlineProps) => {
  return (
    <Text
      style={[styles[type], style]}
      numberOfLines={numberOfLines}
      center={isCentered}
      maxFontSizeMultiplier={2}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    color: appColors.primary,
    fontFamily: appFont.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  h2: {
    color: appColors.mainTextColor,
    fontFamily: appFont.bold,
    fontSize: 16,
    lineHeight: 22,
    textTransform: 'uppercase',
  },
  h3: {
    color: appColors.mainTextColor,
    fontFamily: appFont.bold,
    fontSize: 16,
    lineHeight: 22,
  },
});

export default Headline;
