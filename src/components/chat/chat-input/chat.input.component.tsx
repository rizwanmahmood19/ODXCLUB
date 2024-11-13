import React from 'react';
import { Toast, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { Channel } from 'stream-chat';
import ChatInputPictures from './chat.input.pictures.component';
import { useChatInputSelector } from './chat.input.selector';
import SavedAttachmentList from './saved.attachment.list.component';
import { MatchItem } from '@match-app/shared';
import { ChatInputInner } from './chat.input.inner.component';

export interface ChatInputProps {
  color?: string;
  matchIds: string[];
  channels: Channel[];
  placeholder?: string;
  placeholderColor?: string;
  smallPlaceholder?: string;
  matchItem?: MatchItem;
  scrollEnabled?: boolean;
  disabled?: boolean;
  isPassionAlert?: boolean;
  handleMessageSent?: () => void;
  firstMessageInternalHandler?: () => void;
  AttachmentIcon?: React.FC;
  SendIcon?: React.FC;
}

const ChatInput: React.FC<ChatInputProps> = (props) => {
  const {
    placeholder,
    placeholderColor,
    smallPlaceholder,
    scrollEnabled,
    isPassionAlert,
    AttachmentIcon,
    SendIcon,
    color,
  } = props;
  const {
    message,
    attachmentsListOpen,
    selectedAttachment,
    savedAttachments,
    isDisabled,
    errorMessage,
    isLoading,
    setErrorMessage,
    handleRemovePicture,
    handleMessageChange,
    handleSelectSavedAttachment,
    handleImageSelect,
    isProcessingAttachment,
    handleVideo,
    toggleAttachmentsList,
    handleAudio,
    sendMessage,
  } = useChatInputSelector(props);

  return (
    <>
      <Toast
        visible={!!errorMessage}
        position="top"
        message={errorMessage}
        showDismiss
        allowDismiss
        onDismiss={() => setErrorMessage(undefined)}
        backgroundColor="#f3091aff"
      />
      {attachmentsListOpen && (
        <SavedAttachmentList
          attachments={savedAttachments}
          onSelect={handleSelectSavedAttachment}
          onNewVideo={handleVideo}
          onNewPicture={handleImageSelect}
        />
      )}
      <ChatInputInner
        onSend={sendMessage}
        color={color}
        AttachmentIcon={AttachmentIcon}
        SendIcon={SendIcon}
        message={message}
        onMessageChange={handleMessageChange}
        isLoading={isLoading}
        onSelectMedia={toggleAttachmentsList}
        onAudio={isPassionAlert ? undefined : handleAudio}
        isDisabled={isDisabled}
        placeholder={
          selectedAttachment && smallPlaceholder
            ? smallPlaceholder
            : placeholder
        }
        placeholderColor={placeholderColor}
        scrollEnabled={scrollEnabled}>
        {(selectedAttachment || isProcessingAttachment) && (
          <View style={styles.imagePreviewContainer}>
            <ChatInputPictures
              isProcessingAttachment={isProcessingAttachment}
              selectedAttachments={selectedAttachment && [selectedAttachment]}
              onDelete={handleRemovePicture}
            />
          </View>
        )}
      </ChatInputInner>
    </>
  );
};

const styles = StyleSheet.create({
  imagePreviewContainer: {
    height: 130,
    maxWidth: 160,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});

export default ChatInput;
