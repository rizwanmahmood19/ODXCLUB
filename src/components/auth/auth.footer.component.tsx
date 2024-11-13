import React from 'react';

import { StyleSheet } from 'react-native';
import { Button, View } from 'react-native-ui-lib';
import AuthFooterSeparator from './auth.footer.seperator.component';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';

export interface AuthFooterProps {
  title: string;
  onPress: () => void;
  testID?: string;
}

const AuthFooter = (props: AuthFooterProps) => {
  return (
    <View style={styles.footer}>
      <AuthFooterSeparator />
      <Button
        style={styles.footerButton}
        labelStyle={styles.footerLabel}
        backgroundColor={'white'}
        label={props.title}
        onPress={props.onPress}
        color={appColors.primary}
        testID={props.testID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    zIndex: 0,
  },
  footerButton: {
    borderRadius: 0,
  },
  footerLabel: {
    backgroundColor: 'white',
    fontFamily: appFont.regular,
    fontSize: 15,
    fontWeight: 'normal',
    lineHeight: 20,
  },
});

export default AuthFooter;
