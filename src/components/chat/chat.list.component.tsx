import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import { ChannelList, Chat } from 'stream-chat-react-native';
import { appColors } from '../../style/appColors';
import { theme } from './chat.style';
import { ChatContext } from '../../states/chat.state';
import { AuthContext } from '../../states/auth.state';
import CustomChannelPreview from '../custom/custom.channel.preview.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import PassionAlertLink from '../passion-alert/passion.alert.link.component';
import { ChatListInner } from './chat.list.inner.component';
import ChannelListEmptyStateIndicator from './chat.list.empty.state.indicator.component';
import { Channel } from 'stream-chat';
import { onAddedToChannel, onNewMessage } from './chat.events';

export interface ChatListProps {
  navigation: {
    openChatForChannel: (channel: Channel) => void;
    openPassionAlert: () => void;
  };
}

export const ChatList = (props: ChatListProps) => {
  const { navigation } = props;
  const { client, isLoading } = useContext(ChatContext);
  const { state } = useContext(AuthContext);
  const { streami18n } = useContext(LocalizationContext);

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity}
          size="large"
          color={appColors.primary}
        />
      ) : (
        <Chat client={client} style={theme} i18nInstance={streami18n}>
          <View style={styles.channelListContainer}>
            <PassionAlertLink openPassionAlert={navigation.openPassionAlert} />
            <ChannelList
              List={ChatListInner}
              EmptyStateIndicator={ChannelListEmptyStateIndicator}
              LoadingIndicator={() => null}
              filters={{
                type: 'messaging',
                members: { $in: [state.user!.uid] },
                secretMessage: { $ne: true },
              }}
              // Unfortunately it can happen that the channel.hidden event is not processed at all or not in the correct time,
              // so the channel stays visible until the next channel list refresh.
              // To avoid any flickering or visibility of a channel that should be hidden, we prevent adding it to the list in the first place.
              // This applies to members being added to a channel for: new secret messages, new matches, new to broadcast channel
              onAddedToChannel={onAddedToChannel(client)}
              onMessageNew={onNewMessage(client)}
              sort={{ last_message_at: -1 }}
              options={{
                state: true,
                watch: true,
              }}
              Preview={CustomChannelPreview}
              onSelect={(channel: Channel) => {
                navigation.openChatForChannel(channel);
              }}
            />
          </View>
        </Chat>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
  },
  channelListContainer: {
    display: 'flex',
    height: '100%',
  },
  screen: {
    flex: 1,
  },
});
