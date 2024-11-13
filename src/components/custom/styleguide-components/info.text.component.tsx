import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-ui-lib';

import { appFont } from '../../../style/appFont';
import { appColors } from '../../../style/appColors';

interface InfoTextProps {
  children: string;
  style?: StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;
  testID?: string;
}

const InfoText = (props: InfoTextProps) => {
  const { children, style, testID } = props;

  return (
    <Text
      style={[styles.infoText, style]}
      testID={testID}
      maxFontSizeMultiplier={2}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  infoText: {
    color: appColors.mainTextColor,
    fontFamily: appFont.medium,
    fontSize: 14,
    lineHeight: 18,
  },
});

export default InfoText;
