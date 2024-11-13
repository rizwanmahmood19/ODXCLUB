import React, { useContext } from 'react';
import { ActivityIndicator, Linking, StyleSheet } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';
import {
  openSettings,
  PermissionStatus,
  RESULTS,
} from 'react-native-permissions';

import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import RefreshIcon from '../../../assets/icons/matchapp_ic_refresh-location.svg';
import { appColors } from '../../style/appColors';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appFont } from '../../style/appFont';
import CustomButton from '../custom/styleguide-components/custom.button.component';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '../../services/permission/location.permission';

type NoGpsProps = {
  onRetry: (permission: PermissionStatus) => void;
  isLoadingPosition: boolean;
};

const LOCATION_SETTINGS_URL = 'App-Prefs:root=Privacy&path=LOCATION';

const NoGps: React.FC<NoGpsProps> = ({ onRetry, isLoadingPosition }) => {
  const { l10n } = useContext(LocalizationContext);
  const handlePress = async () => {
    try {
      const result = await checkLocationPermission();
      switch (result) {
        case RESULTS.BLOCKED:
          openSettings(); // Opens app Settings
          break;
        case RESULTS.UNAVAILABLE:
          Linking.canOpenURL(LOCATION_SETTINGS_URL)
            .then((supported) => {
              if (!supported) {
                return;
              } else {
                // Opens Device location settings
                return Linking.openURL(LOCATION_SETTINGS_URL);
              }
            })
            .catch(() => openSettings());
          break;
        default:
          if (result !== RESULTS.GRANTED) {
            requestLocationPermission();
          }
          break;
      }
      onRetry(result);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <View style={styles.container}>
      <LogoIcon style={styles.logo} width={80} height={80} />
      <Text style={styles.title}>{l10n.swipeDeck.noGps.title}</Text>
      <Text style={styles.text}>{l10n.swipeDeck.noGps.text}</Text>
      <CustomButton style={styles.button} onPress={handlePress}>
        {isLoadingPosition ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          l10n.swipeDeck.noGps.button
        )}
      </CustomButton>
      <Button
        style={styles.refreshButton}
        backgroundColor="transparent"
        onPress={handlePress}>
        <RefreshIcon />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: appColors.primary,
    borderRadius: 4,
    marginHorizontal: 10,
    width: '90%',
  },
  container: {
    alignItems: 'center',
    margin: 25,
  },
  logo: {
    margin: 10,
  },
  refreshButton: {
    marginVertical: 20,
  },
  text: {
    color: appColors.darkGrey,
    fontFamily: appFont.regular,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 30,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  title: {
    color: appColors.primary,
    fontFamily: appFont.bold,
    fontSize: 22,
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default NoGps;
