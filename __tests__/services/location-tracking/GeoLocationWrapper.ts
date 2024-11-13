/* eslint-disable @typescript-eslint/ban-ts-comment */
import GeoLocationWrapper from '../../../src/services/location-tracking/GeoLocationWrapper';
// @ts-ignore
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

describe('GeoLocationWrapper', () => {
  it('should call the underlying library', () => {
    const successCallback = jest.fn();
    const errorCallback = jest.fn();
    GeoLocationWrapper.watchPosition(successCallback, errorCallback);

    expect(Geolocation.watchPosition).toHaveBeenCalledTimes(1);
  });

  it('should call the 2nd+ watcher initially with the last position', () => {
    let numWatchers = 0;
    const mockLocation = {
      coords: {
        latitude: 0,
        longtitude: 0,
      },
    };

    // Act as a usual device: when starting watching the location, send one position. But do not
    // re-send position for added watchers later.
    // @ts-ignore
    Geolocation.watchPosition = jest.fn((successCallback) => {
      if (numWatchers === 0) {
        successCallback(mockLocation as any);
      }
      numWatchers++;
      return numWatchers - 1;
    });

    const successCallback = jest.fn();
    const errorCallback = jest.fn();
    GeoLocationWrapper.watchPosition(successCallback, errorCallback);

    const successCallback2 = jest.fn();
    const errorCallback2 = jest.fn();
    GeoLocationWrapper.watchPosition(successCallback2, errorCallback2);

    // Our fix: expect that all watchers are initially called with the last known location
    expect(successCallback).toHaveBeenCalledWith(mockLocation);
    expect(successCallback2).toHaveBeenCalledWith(mockLocation);
  });

  it('should ignore position updates if they did not differ significantly', () => {
    let underlyingSuccessCallback: (p: GeoPosition) => void = () => null;
    Geolocation.watchPosition = jest.fn((successCallback) => {
      underlyingSuccessCallback = successCallback;
      return 0;
    });
    // @ts-ignore
    GeoLocationWrapper.lastWatchPosition = null;

    const successCallback = jest.fn();
    const errorCallback = jest.fn();
    GeoLocationWrapper.watchPosition(successCallback, errorCallback);

    const mockLocation0: GeoPosition = {
      coords: {
        latitude: 52,
        longitude: 13,
      },
    } as GeoPosition;

    const mockLocation1 = {
      coords: {
        latitude: 52.0001,
        longitude: 13.0001,
      },
    } as GeoPosition;

    const mockLocation2 = {
      coords: {
        latitude: 54,
        longitude: 14,
      },
    } as GeoPosition;

    // Now give three position updates
    underlyingSuccessCallback(mockLocation0);
    underlyingSuccessCallback(mockLocation1);
    underlyingSuccessCallback(mockLocation2);

    // But expect that our wrapper filtered location1, as it was an insignificant change
    expect(successCallback).toHaveBeenCalledTimes(2);
    expect(successCallback).toHaveBeenCalledWith(mockLocation0);
    expect(successCallback).toHaveBeenCalledWith(mockLocation2);
  });
});
