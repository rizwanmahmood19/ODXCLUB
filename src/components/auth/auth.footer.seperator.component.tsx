import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import { appColors } from '../../style/appColors';

const AuthFooterSeparator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    alignSelf: 'stretch',
    backgroundColor: appColors.primary,
    height: 1,
  },
});

export default AuthFooterSeparator;
