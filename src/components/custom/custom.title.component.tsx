import React, { ReactNode } from 'react';
import { Text } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';

interface CustomTitleProps {
  children: string | ReactNode;
  center?: boolean;
  style?: Record<string, unknown>;
  uppercase?: boolean;
}

const CustomTitle = (props: CustomTitleProps) => {
  const { children, center, style, uppercase } = props;
  return (
    <Text
      style={[styles.title, style]}
      uppercase={uppercase}
      center={center}
      color={appColors.mainTextColor}
      maxFontSizeMultiplier={2}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: appFont.bold,
    fontSize: 12,
  },
});

export default CustomTitle;
