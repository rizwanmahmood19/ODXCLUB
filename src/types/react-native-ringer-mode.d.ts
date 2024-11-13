declare module 'react-native-ringer-mode' {
  export default {
    getRingerMode(): Promise<'NORMAL' | 'SILENT' | 'VIBRATE'>;,
  };
}
