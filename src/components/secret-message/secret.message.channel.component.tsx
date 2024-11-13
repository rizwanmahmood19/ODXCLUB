import React, { useContext, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import { Channel as ChannelType } from 'stream-chat';
import { View } from 'react-native-ui-lib';
import {
  AttachmentProps,
  Channel,
  Chat,
  MessageList,
  ThemeProvider,
  vw,
} from 'stream-chat-react-native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ChatContext } from '../../states/chat.state';
import { theme } from '../chat/chat.style';
import { LocalizationContext } from '../../services/LocalizationContext';
import CustomSecretMessage from './custom.secret.message.component';
import { useAxios } from '../../util/useAxios';
import { IBlockedProfile, IPublicProfile } from '@match-app/shared';
import { StackActions, useNavigation } from '@react-navigation/core';
import { AppRoute } from '../../navigation/app.routes';
import CustomButton from '../custom/styleguide-components/custom.button.component';
import CustomChatAttachment from '../chat/custom/custom.chat.attachment';
import { appColors } from '../../style/appColors';
import { DeepPartial } from 'stream-chat-react-native-core/lib/typescript/contexts/themeContext/ThemeContext';
import { Theme } from 'stream-chat-react-native-core';

const maxWidth = vw(100) - 120;

interface SecretMessageChannelProps {
  channelId: string;
  profile: IPublicProfile | IBlockedProfile;
  handleIgnore: () => void;
}

const NullComponent = () => null;
const SecretMessageAttachment = (props: AttachmentProps) => (
  <CustomChatAttachment {...props} isDeckSecretMessage={true} />
);

const secretMessageThemeStyles: DeepPartial<Theme> = {
  ...theme,
  messageList: {
    ...theme.messageList,
    container: { backgroundColor: 'transparent', height: 100 },
    contentContainer: { backgroundColor: 'transparent' },
  },
  messageSimple: {
    ...theme.messageSimple,
    container: { width: '100%' },
    content: {
      markdown: {
        text: {
          color: appColors.secondary,
        },
      },
      container: {
        marginBottom: 15,
      },
      containerInner: {
        borderWidth: 0,
        backgroundColor: 'white',
        borderColor: 'transparent',
      },
      textContainer: {
        borderWidth: 0,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        width: maxWidth,
        maxWidth: maxWidth,
        paddingHorizontal: 14,
      },
    },
  },
};

const SecretMessageChannel = (props: SecretMessageChannelProps) => {
  const { channelId, profile, handleIgnore } = props;
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [channel, setChannel] = useState<ChannelType>();
  const { l10n, streami18n } = useContext(LocalizationContext);
  const navigation = useNavigation();

  const {
    client,
    isLoading: isChatLoading,
    refreshChatList,
  } = useContext(ChatContext);

  const [{ loading: acceptLoading }, acceptSecretMessage] = useAxios({
    method: 'post',
    initial: false,
  });

  const handleReply = async () => {
    await acceptSecretMessage({
      url: `matching/secret-message/accept/${profile.id}`,
    });
    navigation.dispatch(
      StackActions.replace(AppRoute.CHAT, {
        channelId,
      }),
    );
    refreshChatList();
  };

  const onMount = async () => {
    setIsChannelLoading(true);
    if (channelId) {
      const [channels, hiddenChannels] = await Promise.all([
        client.queryChannels(
          {
            type: 'messaging',
            id: channelId,
          },
          {},
          {
            state: true,
            watch: true,
          } as any,
        ),
        client.queryChannels(
          {
            type: 'messaging',
            id: channelId,
            hidden: true,
          },
          {},
          {
            state: true,
            watch: true,
          } as any,
        ),
      ]);
      const combinedChannels = [...hiddenChannels, ...channels];
      if (combinedChannels.length) {
        setChannel(combinedChannels[0]);
      } else {
        Sentry.captureException(
          new Error(`No such channel with ID ${channelId} for Secret Message`),
        );
      }
    }
    setIsChannelLoading(false);
  };

  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isChannelLoading || isChatLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loading} size="large" color="white" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        <ThemeProvider style={secretMessageThemeStyles}>
          <Chat client={client} style={theme} i18nInstance={streami18n}>
            <Channel
              channel={channel}
              messageActions={() => []}
              onLongPressMessage={() => undefined}
              MessageSimple={CustomSecretMessage}
              supportedReactions={[]}
              Attachment={SecretMessageAttachment}
              MessageStatus={NullComponent}
              MessageFooter={NullComponent}
              disableKeyboardCompatibleView={true}>
              <MessageList
                isOnline={true}
                loading={false}
                DateHeader={NullComponent}
                InlineDateSeparator={NullComponent}
              />
            </Channel>
          </Chat>
        </ThemeProvider>
      </View>
      <View style={styles.buttonsContainer}>
        <CustomButton
          type="outline"
          color="white"
          style={styles.button}
          onPress={handleIgnore}>
          {l10n.secretMessage.receive.ignore}
        </CustomButton>
        <CustomButton
          isLoading={acceptLoading}
          type="outline"
          color="white"
          style={styles.button}
          onPress={handleReply}>
          {l10n.secretMessage.receive.reply}
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexBasis: 140,
    margin: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    left: -5,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    minHeight: 320,
    width: '100%',
  },
  loading: {
    paddingTop: 50,
  },
});

export default SecretMessageChannel;
