import { useCallback, useContext, useEffect, useState } from 'react';
import { useSendLocation } from './useSendLocation';
import { PermissionStatus, RESULTS } from 'react-native-permissions';
import {
  GeoError,
  GeoPosition,
  PositionError,
} from 'react-native-geolocation-service';
import { useFocusEffect } from '@react-navigation/core';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '../permission/location.permission';
import { ProfileContext } from '../../states/profile.state';
import GeoLocationWrapper, { Location } from './GeoLocationWrapper';
import { useAppState } from '../app.state';

export const useTrackLocation = () => {
  const [permissionState, setPermissionState] =
    useState<PermissionStatus | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [position, setPosition] = useState<Location | undefined>();
  const [error, setError] = useState<GeoError>();
  const [toastError, setToastError] = useState<GeoError>();
  const [isReady, setIsReady] = useState(false);
  const { appState } = useAppState();

  const closeErrorToast = () => setToastError(undefined);

  const checkAndSetPermission = async () => {
    return checkLocationPermission().then(setPermissionState);
  };

  useFocusEffect(
    useCallback(() => {
      // Check permission every time the user focuses on Recom-stream
      checkAndSetPermission();
    }, []),
  );

  useEffect(() => {
    // Since we are only allowed to use GPS while the app is open, GPS location watching stops with an error
    // once the app goes into background. This is an error we can reset (= re-try) automatically once the app
    // is back in foreground.
    const isAppInForeground = appState === 'active';
    if (
      isAppInForeground &&
      error?.code === PositionError.POSITION_UNAVAILABLE
    ) {
      console.log(
        'Clearing POSITION_UNAVAILABLE error after coming into foreground',
      );
      setError(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  useEffect(() => {
    if (!permissionState) {
      return;
    }

    switch (permissionState) {
      case RESULTS.GRANTED: // The permission is granted
        // do nothing, we have a separate useEffect to handle starting/stopping position watching
        break;
      case RESULTS.DENIED: // The permission has not been requested / is denied but requestable
        requestLocationPermission().then((p) => {
          setPermissionState(p);
          setIsReady(true);
          setIsLoading(false);
        });
        break;
      case RESULTS.BLOCKED: // The permission is denied and not requestable anymore
        setIsReady(true);
        setIsLoading(false);
        break;
      case RESULTS.UNAVAILABLE: // This feature is not available (on this device / in this context)
        setPosition(undefined);
        setIsReady(true);
        setIsLoading(false);
        break;
    }
  }, [permissionState]);

  const evaluateError = (err: GeoError) => {
    if (
      err.code === PositionError.POSITION_UNAVAILABLE ||
      err.code === PositionError.SETTINGS_NOT_SATISFIED ||
      err.code === PositionError.PERMISSION_DENIED
    ) {
      setError(err);
    } else {
      setToastError(err);
    }
  };

  const onWatchPositionSuccess = (r: GeoPosition) => {
    console.debug(
      `Geolocation.watchPosition() result: ${JSON.stringify(r, null, 2)}`,
    );
    setError(undefined);
    setIsLoading(false);
    setIsReady(true);

    const currentLocation = {
      lat: r.coords.latitude,
      lon: r.coords.longitude,
    };
    setPosition(currentLocation);
  };

  const onWatchPositionFailure = (e: GeoError) => {
    console.debug(
      `GeoLocation.watchPosition() error: ${JSON.stringify(e, null, 2)}`,
    );
    evaluateError(e);
    setPosition(undefined);
    setIsLoading(false);
    setIsReady(true);
  };

  useEffect(() => {
    // Only start watching if the app is in foreground and we have the required permissions
    if (permissionState !== RESULTS.GRANTED) {
      return;
    }

    // Only re-try watching if the previous watching-session did not quit due to an error
    if (error !== undefined) {
      return;
    }

    const watchId = startWatchingPosition();

    return () => clearWatchPosition(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionState, error]);

  const startWatchingPosition = () => {
    setIsLoading(true);
    setIsReady(false);

    const watchId = GeoLocationWrapper.watchPosition(
      onWatchPositionSuccess,
      onWatchPositionFailure,
    );
    console.debug(
      'Geolocation.watchPosition() started (watchId: ' + watchId + ')',
    );
    return watchId;
  };

  const clearWatchPosition = (watchId: number) => {
    console.debug('Disabling position watching (watchId: ' + watchId + ')');
    GeoLocationWrapper.clearWatch(watchId);
    setIsLoading(false);
    setIsReady(true);
  };

  const { sendLocationToExternal, isUpdating } = useSendLocation();
  const {
    state: { profile },
  } = useContext(ProfileContext);

  const onRetry = (p: PermissionStatus) => {
    setPermissionState(p);
    // Clear error -> retry
    setError(undefined);
  };

  useEffect(() => {
    if (!position) {
      return;
    }

    sendLocationToExternal(position).then(() => setIsReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return {
    error,
    toastError,
    position,
    permissionState,
    isLoadingPosition: isLoading,
    // If the user didn't allow location during onboarding,
    // We need to wait until we have a lastlocation set in the BE
    isReady: isReady && !(!profile?.lastLocation && isUpdating),
    closeErrorToast,
    onRetry,
    sendLocationToExternal,
  };
};
