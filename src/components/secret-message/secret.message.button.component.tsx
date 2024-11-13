import React, { useContext, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import SecretMessageInactiveIcon from '../../../assets/icons/matchapp_ic_secret_m_inaktive.svg';
import SecretMessageColorIcon from '../../../assets/icons/matchapp_ic_secret_message_profile.svg';
import SecretMessageIcon from '../../../assets/icons/matchapp_ic_secret_m_white.svg';
import { ProfileContext } from '../../states/profile.state';
import moment from 'moment';
import InfoText from '../custom/styleguide-components/info.text.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { PortalContext } from '../../util/PortalContext';
import { Text, TouchableOpacity } from 'react-native-ui-lib';
import { appFont } from '../../style/appFont';
import { CustomToast } from '../custom/custom.toast.component';

type SecretMessageButtonProps = {
  onPress: () => void;
  colorful: boolean;
  isDisabled?: boolean;
  size?: number;
  isMessageReceived?: boolean;
};

const SecretMessageButton: React.FC<SecretMessageButtonProps> = ({
  colorful,
  onPress,
  isDisabled,
  size = 50,
  isMessageReceived,
}) => {
  const Icon = isDisabled
    ? SecretMessageInactiveIcon
    : colorful
    ? SecretMessageColorIcon
    : SecretMessageIcon;
  const { state } = useContext(ProfileContext);
  const { l10n } = useContext(LocalizationContext);
  const lastSecretMessageSentAt = state?.profile?.lastSecretMessageSentAt;
  const { teleport, gates } = useContext(PortalContext);
  const notificationTimeout = useRef<undefined | number>();
  const deleteNotification = () => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    teleport('secret-message-toast', null);
  };
  const teleportNotification = () => {
    teleport(
      'secret-message-toast',
      <CustomToast
        onPress={deleteNotification}
        backgroundColor="rgba(90,90,90,0.85)">
        <View style={styles.hintContent}>
          <View style={styles.textContents}>
            <Text style={styles.headline}>
              {l10n.secretMessage.send.hint.title}
            </Text>
            <InfoText style={styles.info}>
              {`${l10n.secretMessage.send.hint.text} ${
                lastSecretMessageSentAt &&
                l10n.formatString(
                  l10n.secretMessage.send.hint.timeText,
                  `${moment
                    .utc(
                      moment(lastSecretMessageSentAt)
                        .add(1, 'day')
                        .diff(moment()),
                    )
                    .format('HH:mm')}h`,
                )
              }`}
            </InfoText>
          </View>
          <SecretMessageColorIcon style={styles.icon} height={50} width={50} />
        </View>
      </CustomToast>,
    );
    notificationTimeout.current = setTimeout(deleteNotification, 5000) as any;
  };

  const handlePress = () => {
    if (isDisabled || gates['secret-message-toast']) {
      return;
    }
    if (
      lastSecretMessageSentAt &&
      moment().isBefore(moment(lastSecretMessageSentAt).add(1, 'day')) &&
      !isMessageReceived
    ) {
      teleportNotification();
    } else {
      onPress();
    }
  };
  return (
    <>
      <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
        <Icon width={size} height={size} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  headline: {
    color: '#ffffff',
    fontFamily: appFont.bold,
    fontSize: 21,
  },
  hintContent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingLeft: 18,
    paddingRight: 12,
    paddingTop: 6,
  },
  icon: {
    flex: 1,
    width: '15%',
  },
  info: {
    color: '#ffffff',
    fontFamily: appFont.semiBold,
    fontSize: 11,
    paddingTop: 3,
  },
  textContents: {
    maxWidth: '80%',
  },
});

export default SecretMessageButton;
