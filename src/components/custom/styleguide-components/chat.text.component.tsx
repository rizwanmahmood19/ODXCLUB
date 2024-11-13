import React from 'react';
import { Text } from 'react-native-ui-lib';
import { appFont } from '../../../style/appFont';
import { appColors } from '../../../style/appColors';
import { StyleProp, TextStyle } from 'react-native';

interface ChatTextProps {
  children: string;
  isMyMessage: boolean;
  style?: StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;
}

const ChatText = (props: ChatTextProps) => {
  const { children, isMyMessage, style } = props;

  return (
    <Text
      style={[styles(isMyMessage).chatText, style]}
      maxFontSizeMultiplier={2}>
      {children}
    </Text>
  );
};

const styles = (isMyMessage: boolean) => ({
  chatText: {
    color: isMyMessage ? '#FFFFFF' : appColors.mainTextColor,
    fontFamily: appFont.medium,
    fontSize: 14,
    lineHeight: 18,
  },
});

export default ChatText;
