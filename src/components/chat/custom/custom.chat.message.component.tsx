import React, { useMemo } from 'react';
import {
  MessageContext,
  MessageSimple,
  ThemeProvider,
  useMessageContext,
} from 'stream-chat-react-native';
import { appColors } from '../../../style/appColors';
import { theme } from '../chat.style';
import VideoCallInfoMessage from '../../video-call/video-call.info.message';

function processMessageText(
  messageText: string | undefined,
  isPassionAlert: boolean,
  isSecretMessage: boolean,
) {
  if (isPassionAlert) {
    return `#Passion Alert!\n${messageText}`;
  }
  if (isSecretMessage) {
    return `#Secret Message!\n${messageText}`;
  }
  return messageText;
}

const sentMessageStyles = (isSpecial: boolean, isEmpty: boolean) => {
  return {
    content: {
      markdown: {
        text: {
          color: '#ffffff',
        },
        heading1:
          isSpecial && isEmpty
            ? {
                marginBottom: 8,
              }
            : undefined,
      },
      textContainer: {
        paddingHorizontal: 14,
        backgroundColor: isSpecial ? appColors.secondary : appColors.primary,
      },
    },
  };
};

const receivedMessageStyles = (isSpecial: boolean, isEmpty: boolean) => ({
  content: {
    markdown: {
      text: {
        color: '#000000',
      },
      heading1:
        isSpecial && isEmpty
          ? {
              marginBottom: 8,
            }
          : undefined,
    },
    textContainer: {
      paddingHorizontal: 14,
      backgroundColor: isSpecial
        ? appColors.secondaryLighter
        : appColors.primaryLighter,
    },
  },
});

const CustomChatMessage = () => {
  const { message, isMyMessage, ...otherProps } = useMessageContext();
  const isPassionAlert = !!message.isPassionAlert;
  const isSecretMessage = !!message.isSecretMessage;
  const processedMessage = useMemo(
    () => ({
      ...message,
      text: processMessageText(message.text, isPassionAlert, isSecretMessage),
    }),
    [message, isSecretMessage, isPassionAlert],
  );
  const isEmpty = message.text?.trim().length === 0;
  return (
    <>
      {message.isVideoInfoMessage ? (
        <VideoCallInfoMessage />
      ) : (
        <ThemeProvider
          style={{
            ...theme,
            messageSimple: {
              ...theme.messageSimple,
              ...(isMyMessage
                ? sentMessageStyles(isPassionAlert || isSecretMessage, isEmpty)
                : receivedMessageStyles(
                    isPassionAlert || isSecretMessage,
                    isEmpty,
                  )),
            },
          }}>
          <MessageContext.Provider
            value={{ message: processedMessage, isMyMessage, ...otherProps }}>
            <MessageSimple />
          </MessageContext.Provider>
        </ThemeProvider>
      )}
    </>
  );
};

export default CustomChatMessage;
