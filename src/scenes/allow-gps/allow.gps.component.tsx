import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Assets, Image, View } from 'react-native-ui-lib';

import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import { appFont } from '../../style/appFont';
import GPSIcon from '../../../assets/icons/allow-gps.svg';
import { requestLocationPermission } from '../../services/permission/location.permission';
import { SetupContext } from '../../states/SetupContext';

export const AllowGPSScreen = () => {
  const { l10n } = useContext(LocalizationContext);
  const { onDealtWithGPS } = useContext(SetupContext);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    // Open location permission modal
    await requestLocationPermission();
    await onDealtWithGPS();
  };

  return (
    <View style={styles.container}>
      <Image
        source={Assets.images.allowGPSBackground}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <GPSIcon style={styles.icon} />
        </View>
        <Headline type="h1" style={styles.headline}>
          {l10n.allowGPS.headline}
        </Headline>
        <InfoText style={styles.infoText}>{l10n.allowGPS.text}</InfoText>
        <CustomButton
          style={styles.button}
          type="outline"
          color="white"
          isLoading={isLoading}
          onPress={handlePress}>
          {l10n.allowGPS.button}
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
    marginBottom: 50,
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
    fontSize: 28,
    lineHeight: 32,
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
});
