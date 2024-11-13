import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ASYNC_STORAGE_KEYS,
  STORAGE_VALUE_FALSE,
  STORAGE_VALUE_TRUE,
} from '../constants';
import { initAppsFlyer } from './appsflyer.analytics';
import appsFlyer from 'react-native-appsflyer';
import {
  getTrackingStatus,
  requestTrackingPermission,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import { useAxios } from '../util/useAxios';
import { Alert } from 'react-native';
import { InitialTosAgreeRecording } from '@match-app/shared';
import { LocalizationContext } from '../services/LocalizationContext';

export type TrackingContextState = {
  initialTosAgreeId: string | null;
  isLoading: boolean;
  trackingEnabled: boolean;
  isLoadingAcceptInitialTOS: boolean;
  trackingStatus?: TrackingStatus;
  requestTracking: () => Promise<TrackingStatus>;
  toggleTracking: () => Promise<void>;
  resetInitialTosAgree: () => Promise<void>;
  acceptInitialTOS: () => Promise<void>;
  logAppsFlyerEvent: (
    eventName: string,
    eventValues?: Record<string, unknown>,
  ) => Promise<void>;
};
const initialValues: TrackingContextState = {
  initialTosAgreeId: null,
  isLoading: true,
  trackingEnabled: true,
  requestTracking: () => Promise.resolve('unavailable'),
  resetInitialTosAgree: () => Promise.resolve(),
  toggleTracking: () => Promise.resolve(),
  isLoadingAcceptInitialTOS: false,
  acceptInitialTOS: () => Promise.resolve(),
  logAppsFlyerEvent: () => Promise.resolve(),
};
export const TrackingContext =
  createContext<TrackingContextState>(initialValues);

export const TrackingProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(initialValues.isLoading);
  const [trackingEnabled, setTrackingEnabled] = useState(
    initialValues.trackingEnabled,
  );
  useState<string | null>(null);
  const [initialTosAgreeId, setInitialTosAgreeId] =
    useState<string | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>();
  const { l10n } = useContext(LocalizationContext);

  const [{ loading: isLoadingAcceptInitialTOS }, acceptInitialTOS] =
    useAxios<InitialTosAgreeRecording>({
      url: '/profile/initial-tos-agree',
      method: 'POST',
      onError: (error) => {
        console.error(error.response);
        Alert.alert(
          l10n.trackingScreen.error.title,
          l10n.trackingScreen.error.description,
        );
      },
      onSuccess: async ({ data: { id } }) => {
        await AsyncStorage.setItem(
          ASYNC_STORAGE_KEYS.INITIAL_TOS_AGREE_RECORDING_ID,
          id,
        );
        setInitialTosAgreeId(id);
      },
    });

  const onMount = async () => {
    if (
      (await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TRACKING_ENABLED)) ===
      STORAGE_VALUE_FALSE
    ) {
      setTrackingEnabled(false);
    }
    setInitialTosAgreeId(
      await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.INITIAL_TOS_AGREE_RECORDING_ID,
      ),
    );
    try {
      setTrackingStatus(await getTrackingStatus());
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  const logAppsFlyerEvent = async (
    eventName: string,
    eventValues = {},
  ): Promise<void> => {
    if (
      trackingEnabled &&
      (trackingStatus === 'authorized' || trackingStatus === 'unavailable')
    ) {
      console.info(`Logged ${eventName} to AppsFlyer.`);
      await appsFlyer.logEvent(eventName, eventValues);
    } else {
      console.info(
        `Skipped AppsFlyer event ${eventName} since tracking is disabled.`,
      );
    }
  };

  const resetInitialTosAgree = async () => {
    await AsyncStorage.removeItem(
      ASYNC_STORAGE_KEYS.INITIAL_TOS_AGREE_RECORDING_ID,
    );
    setInitialTosAgreeId(null);
  };
  const requestTracking = async () => {
    const trackingPermission = await requestTrackingPermission();
    setTrackingStatus(trackingPermission);
    return trackingPermission;
  };

  const toggleTracking = async () => {
    const updatedTrackingEnabled = !trackingEnabled;
    if (
      updatedTrackingEnabled &&
      trackingStatus !== 'authorized' &&
      trackingStatus !== 'restricted'
    ) {
      await requestTracking();
    }
    await new Promise((resolve) => {
      // this also reactivates appsflyer when it has been stopped
      appsFlyer.stop(!updatedTrackingEnabled, () => {
        if (updatedTrackingEnabled) {
          console.info('Restarted AppsFlyer.');
        } else {
          console.info('Stopped AppsFlyer.');
        }
        resolve(undefined);
      });
    });
    await AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.TRACKING_ENABLED,
      updatedTrackingEnabled ? STORAGE_VALUE_TRUE : STORAGE_VALUE_FALSE,
    );
    setTrackingEnabled(updatedTrackingEnabled);
  };

  useEffect(() => {
    onMount();
  }, []);

  useEffect(() => {
    if (trackingEnabled && initialTosAgreeId) {
      initAppsFlyer().catch(console.error);
    }
  }, [trackingEnabled, initialTosAgreeId]);

  return (
    <TrackingContext.Provider
      value={{
        acceptInitialTOS: async () => {
          await acceptInitialTOS();
        },
        isLoading,
        isLoadingAcceptInitialTOS,
        initialTosAgreeId,
        resetInitialTosAgree,
        trackingEnabled,
        trackingStatus,
        toggleTracking,
        requestTracking,
        logAppsFlyerEvent,
      }}>
      {children}
    </TrackingContext.Provider>
  );
};
