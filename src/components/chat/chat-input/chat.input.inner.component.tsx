import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import { ActivityIndicator, StyleSheet, Text, TextInput } from 'react-native';
import AttachmentIconBlue from '../../../../assets/icons/matchapp_attachment.svg';
import AudioIconBlue from '../../../../assets/icons/matchapp_microphone.svg';
import SendIconBlue from '../../../../assets/icons/matchapp_send.svg';
import { appColors } from '../../../style/appColors';
import { appFont } from '../../../style/appFont';
import ChatInputAudio from './chat.input.audio.component';
import { appStyles } from '../../../style/appStyle';
import { is_iOS } from '../../../util/osCheck';
import Label from '../../custom/styleguide-components/label.component';

type ChatInputInnerProps = {
  message: string;
  maxLength?: number;
  onMessageChange: (value: string) => void;
  isLoading?: boolean;
  onSelectMedia?: () => void;
  onAudio?: (filePath: string, duration: number) => void;
  onSend: () => Promise<boolean>;
  placeholder?: string;
  placeholderColor?: string;
  isDisabled?: boolean;
  color?: string;
  textColor?: string;
  AttachmentIcon?: React.FC;
  AudioIcon?: React.FC;
  SendIcon?: React.FC;
  isSecretMessage?: boolean;
};

export const ChatInputInner: React.FC<ChatInputInnerProps> = ({
  message,
  onMessageChange,
  isLoading,
  color = appColors.primary,
  textColor = appColors.mainTextColor,
  onSelectMedia,
  onAudio,
  children,
  onSend,
  isDisabled,
  placeholder,
  placeholderColor,
  maxLength,
  AttachmentIcon = AttachmentIconBlue,
  AudioIcon = AudioIconBlue,
  SendIcon = SendIconBlue,
  isSecretMessage,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const styles = getStyles(color, textColor);
  const handleMessageChange = (value: string) => {
    if (typeof maxLength !== 'number' || value.length <= maxLength) {
      onMessageChange(value);
    }
  };
  return (
    <>
      <View style={styles.container}>
        {typeof maxLength === 'number' && (
          <View style={styles.counter}>
            <Label style={styles.counterText}>{`${
              maxLength - message.length
            }`}</Label>
          </View>
        )}
        <View style={styles.actionsContainer}>
          {onSelectMedia && (
            <TouchableOpacity activeOpacity={0.8} onPress={onSelectMedia}>
              <AttachmentIcon
                style={styles.attachmentIcon}
                width={22}
                height={22}
              />
            </TouchableOpacity>
          )}
          {onAudio && (
            <View style={styles.audioContainer}>
              {message.length ? null : (
                <ChatInputAudio
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                  onAudio={onAudio}
                  AudioIcon={AudioIcon}
                  isSecretMessage={isSecretMessage}
                />
              )}
            </View>
          )}
        </View>
        <View style={styles.inputStyle}>
          {children}
          <View style={styles.textFieldContainer}>
            <TextInput
              style={[
                styles.textField,
                (isRecording && styles.textFieldHidden) || {},
              ]}
              textAlignVertical="top"
              value={message}
              onChangeText={handleMessageChange}
              multiline={true}
              scrollEnabled={true}
            />
            {!(message || '').length && !isRecording && (
              <Text style={[styles.placeholder, { color: placeholderColor }]}>
                {placeholder}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.sendButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSend}
            disabled={isDisabled}>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={textColor || appColors.primary}
              />
            ) : (
              <SendIcon width={24} height={24} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const getStyles = (color: string, textColor: string) =>
  StyleSheet.create({
    actionsContainer: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      marginBottom: 4,
      position: 'relative',
      zIndex: is_iOS ? 2 : undefined,
    },
    attachmentIcon: {
      marginVertical: 6,
    },
    audioContainer: {
      position: 'relative',
      width: 15,
    },
    container: {
      alignItems: 'flex-end',
      borderColor: color,
      borderRadius: appStyles.borderRadius,
      borderWidth: 2,
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 12,
      marginHorizontal: 12,
      minHeight: 60,
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    counter: {
      position: 'absolute',
      right: 6,
      top: 3,
    },
    counterText: {
      color: 'white',
      fontFamily: appFont.regular,
      fontSize: 9,
    },
    imagePreviewContainer: {
      height: 130,
      maxWidth: 160,
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    inputStyle: {
      flexGrow: 1,
      flexShrink: 1,
      paddingBottom: 3,
      zIndex: is_iOS ? 1 : undefined,
    },
    loading: {
      left: -30,
      position: 'absolute',
      zIndex: 1,
    },
    photoIconPA: {
      marginVertical: 3,
    },
    placeholder: {
      bottom: 0,
      fontFamily: appFont.regular,
      fontSize: 12,
      left: 3,
      minHeight: 32,
      position: 'absolute',
      zIndex: 0,
    },
    sendButtonContainer: {
      alignItems: 'flex-end',
      flexBasis: 35,
      justifyContent: 'flex-end',
      padding: 3,
    },
    textField: {
      color: textColor,
      fontFamily: appFont.medium,
      marginHorizontal: 0,
      marginTop: 0,
      maxHeight: 68,
      minHeight: 35,
      padding: 0,
      zIndex: 1,
    },
    textFieldContainer: {
      marginHorizontal: 10,
      marginTop: 8,
      position: 'relative',
    },
    textFieldHidden: {
      display: 'none',
    },
  });
