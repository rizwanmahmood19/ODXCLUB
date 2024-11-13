import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Button } from 'react-native-ui-lib';

import { appFont } from '../../../style/appFont';
import { appColors } from '../../../style/appColors';
import { openLink } from '../../../services/linking';

interface CustomLinkProps {
  label: string;
  url: string;
  style?: StyleProp<ViewStyle>;
  linkColor?: string;
}

const CustomLink = (props: CustomLinkProps) => {
  const { url, label, style, linkColor } = props;

  const handlePress = () => openLink(url);

  return (
    <Button
      link
      label={label}
      onPress={handlePress}
      linkColor={linkColor || appColors.primary}
      labelStyle={[styles.link, style]}
    />
  );
};

const styles = StyleSheet.create({
  link: {
    fontFamily: appFont.medium,
    fontSize: 14,
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
});

export default CustomLink;
