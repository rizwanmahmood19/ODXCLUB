import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { AccessibilityInfo, NativeModules } from 'react-native';
import * as auth from './src/services/authentication';

NativeModules.StatusBarManager = { getHeight: jest.fn() };
jest
  .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
  .mockImplementation(() => new Promise.resolve(false));

// mock native modules
jest.mock('@react-native-community/blur', () => {});
jest.mock('@sentry/react-native', () => ({
  captureMessage: () => {},
}));
jest.mock('@react-native-community/netinfo', () => {});
jest.mock('react-native-appsflyer', () => ({
  logEvent: () => {},
  initSdk: () => {},
}));
jest.mock('@react-native-firebase/messaging', () => () => ({
  getToken: () => Promise.resolve('123'),
}));
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-firebase/auth', () => {});
jest.mock('@ptomasroos/react-native-multi-slider', () => {});
jest.mock('rn-fetch-blob', () => {});
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios', // or 'android'
  select: () => null,
}));
jest.mock('@react-native-firebase/analytics', () => {});

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

// mock own modules
jest.spyOn(auth, 'userToken').mockImplementation(() => {
  return Promise.resolve(undefined);
});

jest.spyOn(auth, 'currentUser').mockImplementation(() => {
  return null;
});
