import React, { useContext } from 'react';
import { Avatar } from 'stream-chat-react-native';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { LocalizationContext } from '../../services/LocalizationContext';
import { AuthContext } from '../../states/auth.state';
import { ChannelPreviewMessengerProps } from 'stream-chat-react-native-core/src/components/ChannelPreview/ChannelPreviewMessenger';
import { navigate } from '../../services/navigate';
import { AppRoute } from '../../navigation/app.routes';
import { LatestMessagePreview } from 'stream-chat-react-native-core/src/components/ChannelPreview/hooks/useLatestMessagePreview';
import { CustomChannelPreviewIcon } from './custom.channel.preview.icon.component';
import {
  GET_STREAM_ADMIN_USER,
  GET_STREAM_BROADCAST_CHANNEL,
} from '@match-app/shared';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import { Channel } from 'stream-chat';

function getMessagePreviewText(
  latestMessagePreview: LatestMessagePreview,
  isLatestPassionAlert: boolean,
  isLatestSecretMessage: boolean,
  l10n: any,
) {
  if (latestMessagePreview.messageObject?.info === 'missed-call') {
    return l10n.videoCall.missed;
  }
  if (latestMessagePreview.messageObject?.info === 'declined-call') {
    return l10n.videoCall.declined;
  }
  const attachments = latestMessagePreview.messageObject?.attachments;
  let text = latestMessagePreview.messageObject?.text || '';
  if (
    attachments?.length &&
    attachments[0].type &&
    l10n.chat.messagePreview[attachments[0].type]
  ) {
    text = l10n.chat.messagePreview[attachments[0].type];
  }

  if (isLatestPassionAlert) {
    text = `Passion Alert! ${text}`;
  } else if (isLatestSecretMessage) {
    text = `Secret Message! ${text}`;
  }
  return text.replace(/\n/g, ' ');
}

function getChannelPreviewDisplayData(
  currentChannel: Channel,
  userId?: string,
) {
  const channelData = currentChannel?.data;
  const channelName = channelData?.name;
  const channelImage = channelData?.image;
  const members = currentChannel.state?.members;
  const otherMemberId = Object.keys(currentChannel.state?.members ?? {}).find(
    (id) => id !== userId,
  );
  const isInternalChat =
    currentChannel.id === GET_STREAM_BROADCAST_CHANNEL.ID ||
    otherMemberId === GET_STREAM_ADMIN_USER.ID;
  if (channelData?.matchId && members && otherMemberId) {
    return {
      image: members[otherMemberId].user?.image,
      name: members[otherMemberId].user?.name || channelName,
      isInternalChat,
    };
  }
  return {
    image: channelImage,
    name: channelName,
    isInternalChat,
  };
}

const CustomChannelPreview = ({
  unread = 0,
  latestMessagePreview,
  channel,
}: ChannelPreviewMessengerProps) => {
  const { state } = useContext(AuthContext);

  const { l10n } = useContext(LocalizationContext);
  const isLatestPassionAlert =
    !!latestMessagePreview.messageObject?.isPassionAlert;
  const isLatestSecretMessage =
    !!latestMessagePreview.messageObject?.isSecretMessage;
  const onSelectChannel = () => {
    // ensure the channel is marked read since getstream.io can be unreliable on that
    if (unread > 0) {
      channel.markRead();
    }
    navigate(AppRoute.CHAT, { channelId: channel.id });
  };

  const { image, name, isInternalChat } = getChannelPreviewDisplayData(
    channel,
    state.user?.uid,
  );
  const messagePreview = getMessagePreviewText(
    latestMessagePreview,
    isLatestPassionAlert,
    isLatestSecretMessage,
    l10n,
  );

  const styles = genStyles(
    unread > 0,
    isLatestPassionAlert || isLatestSecretMessage,
  );

  return (
    <TouchableOpacity onPress={onSelectChannel} style={styles.container}>
      {isInternalChat ? (
        <LogoIcon style={styles.logo} />
      ) : (
        <Avatar image={image} name={name} size={60} />
      )}
      <View style={styles.details}>
        <Text style={styles.title}>{name}</Text>
        <Text numberOfLines={1} style={styles.message}>
          {messagePreview}
        </Text>
      </View>
      <CustomChannelPreviewIcon
        isPassionAlert={isLatestPassionAlert}
        isUnread={unread > 0}
        isSecretMessage={isLatestSecretMessage}
      />
    </TouchableOpacity>
  );
};

const genStyles = (isUnread: boolean, isHighlight?: boolean) => {
  let background = 'transparent';
  if (isUnread) {
    background = isHighlight
      ? appColors.secondaryLight
      : appColors.primaryLighter;
  }
  return {
    container: {
      alignItems: 'center',
      backgroundColor: background,
      flexDirection: 'row',
      padding: 10,
    },
    details: {
      flex: 1,
      paddingLeft: 27,
    },
    logo: {
      borderColor: appColors.secondary,
      borderRadius: 30,
      height: 44,
      width: 44,
      margin: 8,
    },
    message: {
      color: `${isUnread ? appColors.mainTextColor : appColors.darkGrey}`,
      fontFamily: `${
        isUnread && isHighlight ? appFont.semiBold : appFont.regular
      }`,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 4,
    },
    title: {
      color: appColors.mainTextColor,
      fontFamily: appFont.semiBold,
      fontSize: 15,
    },
  };
};

export default CustomChannelPreview;
