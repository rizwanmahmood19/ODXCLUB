import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { appColors } from '../../style/appColors';

export const LoadingScreen = () => {
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={appColors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
});
