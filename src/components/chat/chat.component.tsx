import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Text, View } from 'react-native-ui-lib';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { Channel, Chat, MessageList } from 'stream-chat-react-native';
import { appColors } from '../../style/appColors';
import { theme } from './chat.style';
import { ChatHeader } from './chat.header.component';
import { useChatSelector } from './chat.selector';
import { MatchItem } from '@match-app/shared';
import ChatInput from './chat-input/chat.input.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import CustomChatMessage from './custom/custom.chat.message.component';
import { appFont } from '../../style/appFont';
import { is_iOS } from '../../util/osCheck';
import VideoCallModal from '../video-call/video-call.modal';
import CustomChatAttachment from './custom/custom.chat.attachment';
import { useMessageAttachmentDelete } from './custom/useMessageAttachmentDelete';
import { ChatEmptyIndicator } from './chat.empty.indicator';

export interface ChatScreenProps {
  channelId?: string;
  matchItem?: MatchItem;
  goBack: () => void;
}

export const ChatScreen = (props: ChatScreenProps) => {
  const { streami18n, l10n } = useContext(LocalizationContext);
  const { matchItem, goBack } = props;

  const {
    isLoading,
    client,
    error,
    matchState,
    channel,
    isVideoModalOpen,
    openVideoModal,
    closeVideoModal,
    isCaller,
  } = useChatSelector(props);
  const { deleteMessageAttachments } = useMessageAttachmentDelete();
  const [isFirstMessage, setIsFirstMessage] = useState(
    !channel?.data?.last_message_at,
  );

  useEffect(() => {
    setIsFirstMessage(!channel?.data?.last_message_at);
  }, [channel?.id, channel?.data?.last_message_at]);

  if (isLoading) {
    return (
      <View useSafeArea={true} style={styles.screen}>
        <ActivityIndicator size={'large'} color={appColors.primary} />
      </View>
    );
  }

  if (error || !channel || !matchState) {
    return (
      <View useSafeArea={true} style={styles.screen}>
        <Text style={styles.errorText}>
          {l10n.chat.initializationError.title}
        </Text>
        <Button
          style={styles.errorButton}
          labelStyle={styles.errorButtonLabel}
          label={l10n.chat.initializationError.cancel}
          onPress={goBack}
        />
      </View>
    );
  }

  // readonly channels such as broadcast channels or admin 1on1 channels are rendered without an input
  if (channel.data?.readonly) {
    return (
      <View useSafeArea={true} style={styles.safeArea}>
        <ChatHeader
          onCloseChat={goBack}
          name={channel.data?.name || matchState.otherMemberName}
        />
        <KeyboardAvoidingView
          behavior={is_iOS ? 'padding' : undefined}
          style={styles.keyboardAware}>
          <Chat client={client} i18nInstance={streami18n}>
            <Channel
              MessageSimple={CustomChatMessage}
              channel={channel}
              disableKeyboardCompatibleView={true}
              onLongPressMessage={() => undefined}>
              <View style={styles.messageListContainer}>
                <MessageList />
              </View>
            </Channel>
          </Chat>
        </KeyboardAvoidingView>
      </View>
    );
  }
  return (
    <>
      <Modal visible={isVideoModalOpen}>
        <VideoCallModal
          isCaller={isCaller}
          matchState={matchState}
          onClose={closeVideoModal}
          channel={channel}
        />
      </Modal>
      <View useSafeArea={true} style={styles.safeArea}>
        <ChatHeader
          matchId={matchState.matchId}
          otherMemberFirebaseId={matchState.otherMemberFirebaseId}
          thumbnailUrl={matchState.otherMemberThumbnailUrl}
          onCloseChat={goBack}
          openVideoModal={openVideoModal}
          name={matchState.otherMemberName}
        />
        <KeyboardAvoidingView
          behavior={is_iOS ? 'padding' : undefined}
          style={styles.keyboardAware}>
          <Chat client={client} style={theme} i18nInstance={streami18n}>
            <Channel
              channel={channel}
              MessageSimple={CustomChatMessage}
              Attachment={CustomChatAttachment}
              FileAttachment={CustomChatAttachment}
              handleDelete={async (message) => {
                await deleteMessageAttachments(message);
                // OV3-223: also make a hard delete after the soft delete (otherwise the deleted message stays visible in the channel list)
                await client.deleteMessage(message.id, true);
              }}
              messageActions={({ deleteMessage, isMyMessage }) =>
                isMyMessage ? [deleteMessage] : []
              }
              disableKeyboardCompatibleView={true}>
              {isFirstMessage ? (
                <ChatEmptyIndicator
                  thumbnailUrl={matchState?.otherMemberThumbnailUrl}
                  name={matchState?.otherMemberName}
                  createdAt={channel?.data?.created_at as Date}
                />
              ) : (
                <MessageList loading={false} />
              )}
              <View style={styles.chatInputContainer}>
                <ChatInput
                  matchIds={matchState.matchId ? [matchState.matchId] : []}
                  channels={[channel]}
                  color={appColors.primary}
                  placeholder={
                    isFirstMessage
                      ? l10n.formatString(
                          l10n.chat.chatInput.firstMessagePlaceholder,
                          matchState?.otherMemberName,
                        )
                      : l10n.chat.chatInput.placeholder
                  }
                  placeholderColor={
                    isFirstMessage ? appColors.primary : undefined
                  }
                  firstMessageInternalHandler={() => setIsFirstMessage(false)}
                  matchItem={matchItem}
                />
              </View>
            </Channel>
          </Chat>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chatInputContainer: {
    backgroundColor: 'white',
  },
  errorButton: {
    backgroundColor: appColors.primary,
    borderRadius: 4,
  },
  errorButtonLabel: {
    fontFamily: appFont.regular,
    fontSize: 19,
    fontWeight: 'normal',
  },
  errorText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    width: '70%',
  },
  keyboardAware: {
    flex: 1,
  },
  messageListContainer: { flex: 1 },
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  screen: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
  },
});
