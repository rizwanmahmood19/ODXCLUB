import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { LocalizationContext } from '../../services/LocalizationContext';
import PassionAlertIcon from '../../../assets/icons/matchapp_passion_alert.svg';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import { useToggle } from '../../util/useToggle';
import CustomActionSheet from '../custom/custom.action.sheet.component';
import useProfileSettingsSelector from '../profile-settings/profile.settings.selector';

const PASSION_ALERT_ICON_SIZE = 50;

interface PassionAlertLinkProps {
  openPassionAlert: () => void;
}

const PassionAlertLink = ({ openPassionAlert }: PassionAlertLinkProps) => {
  const { l10n } = useContext(LocalizationContext);
  const { initialValues: profile, handleAllowsPassionAlertsChange } =
    useProfileSettingsSelector();

  const [modalVisible, toggleModal] = useToggle(false);
  const onLinkPress = () => {
    if (!profile) {
      return;
    }
    if (profile.allowsPassionAlerts) {
      openPassionAlert();
    } else {
      toggleModal();
    }
  };
  const onActivate = async () => {
    await handleAllowsPassionAlertsChange(true);
    openPassionAlert();
    toggleModal();
  };
  return (
    <>
      <CustomActionSheet
        title={l10n.passionAlert.enableModal.title}
        visible={modalVisible}
        options={[
          {
            id: 'submit',
            label: l10n.passionAlert.enableModal.submit,
            onPress: onActivate,
          },
          {
            id: 'cancel',
            label: l10n.passionAlert.enableModal.cancel,
            onPress: toggleModal,
          },
        ]}
        handleMenuClose={toggleModal}
      />
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={onLinkPress}>
        <View style={styles.avatar}>
          <PassionAlertIcon
            width={PASSION_ALERT_ICON_SIZE}
            height={PASSION_ALERT_ICON_SIZE}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{l10n.passionAlert.link.title}</Text>
          <Text style={styles.text}>{l10n.passionAlert.link.text}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 60,
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 27,
    textAlign: 'center',
  },
  text: {
    color: appColors.darkGrey,
    fontFamily: appFont.regular,
    fontSize: 13,
    paddingTop: 4,
  },
  title: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    fontSize: 15,
  },
});

export default PassionAlertLink;
