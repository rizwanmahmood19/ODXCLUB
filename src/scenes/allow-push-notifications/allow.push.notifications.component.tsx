import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Assets, Image, View } from 'react-native-ui-lib';

import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import { appFont } from '../../style/appFont';
import PushNotificationsIcon from '../../../assets/icons/allow-pns.svg';
import messaging from '@react-native-firebase/messaging';
import Label from '../../components/custom/styleguide-components/label.component';
import { SetupContext } from '../../states/SetupContext';
import { is_iOS } from '../../util/osCheck';
import { openSettings } from 'react-native-permissions';

export const AllowPushNotificationsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { onDealtWithPN } = useContext(SetupContext);
  const handleRequestPress = async () => {
    setIsLoading(true);
    if (is_iOS) {
      await messaging().requestPermission();
      await onDealtWithPN();
    } else {
      try {
        await onDealtWithPN();
        await openSettings();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSkipPress = async () => {
    setIsLoading(true);
    await onDealtWithPN();
  };

  const { l10n } = useContext(LocalizationContext);

  return (
    <View style={styles.container}>
      <Image
        source={Assets.images.allowNotificationsBackground}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <PushNotificationsIcon style={styles.icon} />
        </View>
        <Headline type="h1" style={styles.headline}>
          {l10n.allowPushNotifications.headline}
        </Headline>
        <InfoText style={styles.infoText}>
          {l10n.allowPushNotifications.text}
        </InfoText>
        <CustomButton
          style={styles.button}
          type="outline"
          color="white"
          isLoading={isLoading}
          onPress={handleRequestPress}>
          {l10n.allowPushNotifications.button}
        </CustomButton>
        <CustomButton
          style={styles.linkButton}
          type="link"
          color="white"
          onPress={handleSkipPress}>
          <Label style={styles.linkButtonText}>
            {l10n.allowPushNotifications.linkButton.toUpperCase()}
          </Label>
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 0,
  },
  button: {
    margin: 70,
    marginBottom: 25,
    width: '60%',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    width: '80%',
  },
  headline: {
    color: 'white',
    fontFamily: appFont.black,
    fontSize: 30,
    lineHeight: 33,
    marginVertical: 20,
    textAlign: 'center',
  },
  icon: {
    height: 178,
  },
  iconContainer: {
    marginBottom: 40,
  },
  infoText: {
    color: 'white',
    marginVertical: 20,
    textAlign: 'center',
  },
  linkButton: {
    marginBottom: 20,
    width: '60%',
  },
  linkButtonText: {
    color: 'white',
    fontFamily: appFont.medium,
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'center',
  },
});
