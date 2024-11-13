import { check, request } from 'react-native-permissions';
import { PermissionStatus } from 'react-native-permissions/src/types';
import { locationPermission } from './permission';

export function checkLocationPermission(): Promise<PermissionStatus> {
  return check(locationPermission);
}

export function requestLocationPermission(): Promise<PermissionStatus> {
  return request(locationPermission);
}
