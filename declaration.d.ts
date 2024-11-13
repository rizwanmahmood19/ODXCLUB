declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// untyped libraries
declare module 'react-native-video-controls' {
  const lib: any;
  export default lib;
}

declare module 'format-duration' {
  const lib: any;
  export default lib;
}

declare module 'react-native-shake' {
  const lib: any;
  export default lib;
}

declare module 'react-native-orientation-locker' {
  import { LANDSCAPE, PORTRAIT } from 'react-native-orientation-locker';
  const lib: any;
  export const PORTRAIT: string;
  export const LANDSCAPE: string;
  export const UNLOCK: string;

  export const OrientationLocker: React.FC<{
    orientation: PORTRAIT | LANDSCAPE | UNLOCK;
  }>;
  export default lib;
}
