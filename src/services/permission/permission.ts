import { is_iOS } from '../../util/osCheck';
import {
  check,
  Permission,
  RESULTS,
  request,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import LocalizedStrings from 'react-native-localization';
import { localization } from '@match-app/shared';
import { Alert } from 'react-native';

export const isGranted = (p: string) => p === RESULTS.GRANTED;
export const isLimited = (p: string) => p === RESULTS.LIMITED;

export const microphonePermission = is_iOS
  ? PERMISSIONS.IOS.MICROPHONE
  : PERMISSIONS.ANDROID.RECORD_AUDIO;

export const cameraPermission = is_iOS
  ? PERMISSIONS.IOS.CAMERA
  : PERMISSIONS.ANDROID.CAMERA;

export const galleryPermission = is_iOS
  ? PERMISSIONS.IOS.PHOTO_LIBRARY
  : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

export const locationPermission = is_iOS
  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const l10n = new LocalizedStrings(localization);

export const showPermissionAlert = (title: string, desc: string) => {
  Alert.alert(title, desc, [
    {
      onPress: async () => {
        await openSettings();
      },
      text: l10n.permissionsNativeAlert.button.ok,
    },
    {
      text: l10n.permissionsNativeAlert.button.cancel,
      style: 'cancel',
    },
  ]);
};

const hasPermission = async (
  permission: Permission,
  nativeAlert?: { title: string; desc: string },
  shouldRequestAgain = true,
): Promise<boolean> => {
  switch (await check(permission)) {
    case 'denied':
      if (shouldRequestAgain) {
        await request(permission);
        return hasPermission(permission, undefined, false);
      } else {
        return false;
      }
    case 'limited':
    case 'granted':
      return true;
    case 'unavailable':
    case 'blocked':
      if (nativeAlert) {
        showPermissionAlert(nativeAlert.title, nativeAlert.desc);
      }
      return false;
  }
};

export const galleryPermissionAlertStrings = {
  title: l10n.permissionsNativeAlert.text.photos.title,
  desc: l10n.permissionsNativeAlert.text.photos.desc,
};

export const hasGalleryPermission = async (): Promise<boolean> => {
  return hasPermission(galleryPermission, galleryPermissionAlertStrings);
};

export const cameraPermissionAlertStrings = {
  title: l10n.permissionsNativeAlert.text.camera.title,
  desc: l10n.permissionsNativeAlert.text.camera.desc,
};

export const hasCameraPermission = async (): Promise<boolean> => {
  if (is_iOS) {
    return hasPermission(cameraPermission, cameraPermissionAlertStrings);
  } else {
    // ImagePicker library needs permission for camera and storage for taking pictures in Android
    const cameraPermissionResult = await hasPermission(
      cameraPermission,
      cameraPermissionAlertStrings,
    );
    if (cameraPermissionResult) {
      return hasPermission(galleryPermission, galleryPermissionAlertStrings);
    }
    return false;
  }
};

export const microphonePermissionAlertObject = {
  title: l10n.permissionsNativeAlert.text.microphone.title,
  desc: l10n.permissionsNativeAlert.text.microphone.desc,
};

export const hasMicrophonePermission = async (): Promise<boolean> => {
  return hasPermission(microphonePermission, microphonePermissionAlertObject);
};

export const hasVideoPermission = async (): Promise<boolean> => {
  const cameraPermissionResult = await hasPermission(
    cameraPermission,
    cameraPermissionAlertStrings,
  );
  if (cameraPermissionResult) {
    return hasMicrophonePermission();
  }
  return false;
};
