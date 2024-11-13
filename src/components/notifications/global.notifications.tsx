import React from 'react';
import { PortalGate } from '../../util/PortalContext';
import { SafeAreaView, StyleSheet } from 'react-native';
import { appStyles } from '../../style/appStyle';

const GlobalNotifications = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PortalGate gateName="new-match-toast" />
      <PortalGate gateName="incoming-call-toast" />
      <PortalGate gateName="secret-message-toast" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    left: 12,
    position: 'absolute',
    right: 12,
    top: 12 + appStyles.topMargin,
    zIndex: 2000,
  },
});
export default GlobalNotifications;
