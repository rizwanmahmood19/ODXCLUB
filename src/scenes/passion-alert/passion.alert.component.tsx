import React from 'react';
import { View } from 'react-native-ui-lib';

import PassionAlertHeader from '../../components/passion-alert/passion.alert.header.component';
import PassionAlert from '../../components/passion-alert/passion.alert.component';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { is_iOS } from '../../util/osCheck';

export interface PassionAlertScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export const PassionAlertScreen = ({ navigation }: PassionAlertScreenProps) => {
  return (
    <View style={styles.container} useSafeArea={true}>
      <PassionAlertHeader navigation={navigation} />
      <KeyboardAvoidingView
        behavior={is_iOS ? 'padding' : undefined}
        style={styles.keyboardAware}>
        <PassionAlert />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  keyboardAware: {
    flex: 1,
  },
});
