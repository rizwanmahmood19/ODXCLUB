import React from 'react';
import PassionAlertIconWhite from '../../../assets/icons/matchapp_passion_alert_white.svg';
import SecretMessageIconWhite from '../../../assets/icons/matchapp_ic_secret_message_white.svg';
import { StyleSheet } from 'react-native';

type CustomChannelPreviewIconProps = {
  isPassionAlert: boolean;
  isSecretMessage: boolean;
  isUnread: boolean;
};

export const CustomChannelPreviewIcon: React.FC<CustomChannelPreviewIconProps> =
  ({ isUnread, isSecretMessage, isPassionAlert }) => {
    if (!isUnread) {
      return null;
    }
    if (isPassionAlert) {
      return (
        <PassionAlertIconWhite style={styles.icon} height={48} width={48} />
      );
    }
    if (isSecretMessage) {
      return (
        <SecretMessageIconWhite style={styles.icon} height={48} width={48} />
      );
    }
    return null;
  };
const styles = StyleSheet.create({
  icon: {
    marginLeft: 12,
    marginRight: 6,
  },
});
