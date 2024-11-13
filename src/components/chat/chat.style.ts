import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import { Theme } from 'stream-chat-react-native-core';
import { DeepPartial } from 'stream-chat-react-native-core/lib/typescript/contexts/themeContext/ThemeContext';

// Read more about style customizations at:
// https://getstream.io/chat/react-native-chat/tutorial/#custom-styles

export const theme: DeepPartial<Theme> = {
  avatar: {
    image: {
      height: 32,
      width: 32,
    },
  },
  colors: {
    primary: appColors.primary,
  },
  spinner: {
    width: 15,
    height: 15,
  },
  inlineDateSeparator: {
    container: {
      backgroundColor: appColors.lightGrey,
      height: 16,
    },
    text: {
      fontFamily: appFont.medium,
      fontSize: 11,
      lineHeight: 14,
    },
  },
  messageSimple: {
    content: {
      markdown: {
        heading1: {
          fontSize: 16,
          marginTop: 8,
          marginBottom: 0,
          fontFamily: appFont.bold,
        },
        paragraph: {
          fontSize: 14,
          fontFamily: appFont.medium,
        },
      },
    },
  },
};
