import React from 'react';
import { StyleSheet, View } from 'react-native';
import { appColors } from '../../../style/appColors';

export const Separator = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    borderTopColor: appColors.lightGrey,
    borderTopWidth: 1,
    width: '100%',
  },
  wrapper: {
    paddingHorizontal: '4%',
    width: '100%',
  },
});
