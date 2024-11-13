import Geolocation, {
  GeoError,
  GeoPosition,
  GeoWatchOptions,
  PositionError,
} from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import { checkLocationPermission } from '../permission/location.permission';
import { RESULTS } from 'react-native-permissions';
import { is_iOS } from '../../util/osCheck';

export type Location = {
  lat: number;
  lon: number;
};

const distanceFilter = 500;

export const defaultGeoWatchOptions: GeoWatchOptions = {
  distanceFilter,
  enableHighAccuracy: true,
  interval: 10000,
};

/**
 * Wrapper around the geolocation library, as it works inconsistently:
 * (1) the 2nd+ watcher callback does not receive an initial position via the success callback
 * => manually call callback
 * (2) positionFilter does not seem to work correctly
 * => check if the position actually changed before calling success callback
 */
export default class GeoLocationWrapper {
  private static lastWatchPosition: GeoPosition | null = null;
  private static watchIds = new Set<number>();

  public static watchPosition(
    onSuccessCallback: (position: GeoPosition) => void,
    onErrorCallback: (error: GeoError) => void,
  ): number {
    const watchId = Geolocation.watchPosition(
      (pos) => {
        if (!pos) {
          return;
        }

        // re-implement the distance-filter, as it does not seem to work reliably
        if (this.lastWatchPosition) {
          const distance = getDistance(
            { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
            {
              latitude: this.lastWatchPosition.coords.latitude,
              longitude: this.lastWatchPosition.coords.longitude,
            },
          );

          if (distance < distanceFilter) {
            return;
          }
        }

        this.lastWatchPosition = pos;
        // poor man's clone
        onSuccessCallback(JSON.parse(JSON.stringify(this.lastWatchPosition)));
      },
      (error) => {
        // Ignore falsely permission denied error for a current granted permission.
        //
        // Seems to be the case on iOS when a save warning appears and the device was locked while the app was in the background. ("While Using The App location" location permission state is used)
        //
        // Reproduction steps (simulator):
        //  1) Put app in background
        //  2) Simulate memory warning
        //  3) Lock simulator for some seconds
        //  4) Unlock and open app again
        //  5) Error is fired

        if (is_iOS && error.code === PositionError.PERMISSION_DENIED) {
          checkLocationPermission().then((permission) => {
            if (permission !== RESULTS.GRANTED) {
              // poor man's clone
              onErrorCallback(error);
            }
          });
        } else {
          // poor man's clone
          onErrorCallback(error);
        }
      },
      // actually, the options are only applied for the first watcher and the apply for all watchers.
      // so basically we only can define one set of (default) values for all watchers
      defaultGeoWatchOptions,
    );

    // if this is not the first watcher, it will not receive an initial geo-location callback.
    // To provide uniform behavior, we call the success callback manually on the 2nd+ watcher.
    if (this.watchIds.size > 0 && this.lastWatchPosition != null) {
      // poor man's clone
      onSuccessCallback(JSON.parse(JSON.stringify(this.lastWatchPosition)));
    }
    this.watchIds.add(watchId);

    return watchId;
  }

  public static clearWatch(watchId: number) {
    if (!this.watchIds.has(watchId)) {
      return;
    }

    Geolocation.clearWatch(watchId);
    this.watchIds.delete(watchId);

    if (this.watchIds.size === 0) {
      this.lastWatchPosition = null;
    }
  }
}
