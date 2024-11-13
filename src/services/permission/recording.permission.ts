import { check, request } from 'react-native-permissions';
import { PermissionStatus } from 'react-native-permissions/src/types';
import { microphonePermission } from './permission';

export function checkPermission(): Promise<PermissionStatus> {
  return check(microphonePermission);
}

export function requestPermission(): Promise<PermissionStatus> {
  return request(microphonePermission);
}
