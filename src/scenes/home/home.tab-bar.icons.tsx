import React from 'react';
import LogoIconColor from '../../../assets/icons/matchapp_tabbar_logo.svg';
import LogoIconDisable from '../../../assets/icons/matchapp_tabbar_logo_disable.svg';
import MessageIconColor from '../../../assets/icons/matchapp_tabbar_chat.svg';
import MessageIconDisable from '../../../assets/icons/matchapp_tabbar_chat_disable.svg';
import MaybeIconColor from '../../../assets/icons/matchapp_tabbar_maybe.svg';
import MaybeIconDisable from '../../../assets/icons/matchapp_tabbar_maybe_disable.svg';
import MaybeIconSecretMessage from '../../../assets/icons/matchapp_tabbar_maybe_disable_secret_message.svg';
import PersonIconColor from '../../../assets/icons/matchapp_tabbar_profile.svg';
import PersonIconDisable from '../../../assets/icons/matchapp_tabbar_profile_disable.svg';
import { View } from 'react-native';
import NotificationBubble from '../../components/notification-bubble/notification.bubble.component';

export const MessageIcon = ({
  isFocused,
  hasNotification,
}: {
  isFocused: boolean;
  hasNotification: boolean;
}) => (
  <View>
    {hasNotification && <NotificationBubble />}
    {isFocused ? (
      <MessageIconColor width={52} height={34} />
    ) : (
      <MessageIconDisable width={52} height={34} />
    )}
  </View>
);

export const LogoIcon = ({ isFocused }: { isFocused: boolean }) =>
  isFocused ? (
    <LogoIconColor width={34} height={34} />
  ) : (
    <LogoIconDisable width={34} height={34} />
  );

export const MaybeIcon = ({
  isFocused,
  hasMaybeWithSecretMessage,
}: {
  isFocused: boolean;
  hasMaybeWithSecretMessage: boolean;
}) => {
  if (isFocused) return <MaybeIconColor width={36} height={36} />;
  return hasMaybeWithSecretMessage ? (
    <MaybeIconSecretMessage width={36} height={36} />
  ) : (
    <MaybeIconDisable width={36} height={36} />
  );
};

export const PersonIcon = ({ isFocused }: { isFocused: boolean }) =>
  isFocused ? (
    <PersonIconColor width={27} height={34} />
  ) : (
    <PersonIconDisable width={27} height={34} />
  );
