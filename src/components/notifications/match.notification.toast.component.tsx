import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-ui-lib';

import { IMatchNotificationToast } from '../../util/useNotifcations';
import { CustomToast } from '../custom/custom.toast.component';
import { appColors } from '../../style/appColors';

interface MatchNotificationToastProps {
  toast: IMatchNotificationToast;
  dismissToast: () => void;
}

const MatchNotificationToast = (props: MatchNotificationToastProps) => {
  const { toast, dismissToast } = props;

  return (
    <CustomToast backgroundColor={appColors.primary} onPress={toast.onNavigate}>
      <Button
        style={styles.button}
        onPress={() => {
          if (typeof toast.onNavigate === 'function') {
            toast.onNavigate();
          }
          dismissToast();
        }}>
        <Text style={styles.notificationText}>
          {toast.message}
          {toast.description ? (
            <Text
              style={
                styles.notificationDescription
              }>{`\n${toast.description}`}</Text>
          ) : null}
        </Text>
      </Button>
    </CustomToast>
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: 'transparent' },
  notificationDescription: { fontSize: 15 },
  notificationText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default MatchNotificationToast;
