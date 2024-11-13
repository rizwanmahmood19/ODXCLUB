import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEYS, STORAGE_VALUE_TRUE } from '../constants';
import messaging from '@react-native-firebase/messaging';
import { checkLocationPermission } from '../services/permission/location.permission';
import { RESULTS } from 'react-native-permissions';

export type SetupContextState = {
  isLoading: boolean;
  hasDealtWithPN: boolean;
  hasDealtWithGPS: boolean;
  onDealtWithGPS: () => Promise<void>;
  onDealtWithPN: () => Promise<void>;
};

export const SetupContext = createContext<SetupContextState>({
  hasDealtWithGPS: false,
  hasDealtWithPN: false,
  isLoading: true,
  onDealtWithPN: () => Promise.resolve(),
  onDealtWithGPS: () => Promise.resolve(),
});

export const SetupProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasDealtWithGPS, setHasDealtWithGPS] = useState<boolean>(false);
  const [hasDealtWithPN, setHasDealtWithPN] = useState<boolean>(false);

  /**
   * On first app mount the device should not have permissions for gps
   * and not for push notifications (only on ios, android has pn active automatically)
   *
   * To tackle that we check whether the user has handled these permission problems before
   * If by any chance the user pro actively set the permissions in the settings:
   * we do not show any screens and just skip the setup for this permission.
   */
  const onMount = async () => {
    try {
      const [gpsLS, pnLS] = await Promise.all([
        AsyncStorage.getItem(ASYNC_STORAGE_KEYS.HAS_REQUESTED_GPS_PERMISSION),
        AsyncStorage.getItem(ASYNC_STORAGE_KEYS.HAS_REQUESTED_PN_PERMISSION),
      ]);
      if (gpsLS === STORAGE_VALUE_TRUE) {
        setHasDealtWithGPS(true);
      } else {
        // check if gps was enabled before
        const locationPermission = await checkLocationPermission();
        if (locationPermission === RESULTS.GRANTED) {
          setHasDealtWithGPS(true);
          await AsyncStorage.setItem(
            ASYNC_STORAGE_KEYS.HAS_REQUESTED_GPS_PERMISSION,
            STORAGE_VALUE_TRUE,
          );
        }
      }
      if (pnLS === STORAGE_VALUE_TRUE) {
        setHasDealtWithPN(true);
      } else {
        // check if push notifications are enabled before or by default (android)
        const pushNotificationsPermission = await messaging().hasPermission();
        if (
          pushNotificationsPermission ===
            messaging.AuthorizationStatus.AUTHORIZED ||
          pushNotificationsPermission ===
            messaging.AuthorizationStatus.PROVISIONAL
        ) {
          await AsyncStorage.setItem(
            ASYNC_STORAGE_KEYS.HAS_REQUESTED_GPS_PERMISSION,
            STORAGE_VALUE_TRUE,
          );
          setHasDealtWithPN(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    onMount();
  }, []);

  const onDealtWithGPS = async () => {
    await AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.HAS_REQUESTED_GPS_PERMISSION,
      STORAGE_VALUE_TRUE,
    );
    setHasDealtWithGPS(true);
  };

  const onDealtWithPN = async () => {
    await AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.HAS_REQUESTED_PN_PERMISSION,
      STORAGE_VALUE_TRUE,
    );
    setHasDealtWithPN(true);
  };

  return (
    <SetupContext.Provider
      value={{
        isLoading,
        hasDealtWithPN,
        hasDealtWithGPS,
        onDealtWithPN,
        onDealtWithGPS,
      }}>
      {children}
    </SetupContext.Provider>
  );
};
