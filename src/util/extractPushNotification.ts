import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import _get from 'lodash.get';
import { PUSH_NOTIFICATION_ACTIONS } from '@match-app/shared';

export type PNMessageResult = {
  type: keyof typeof PUSH_NOTIFICATION_ACTIONS;
  message?: string;
  description?: string;
  matchId?: string;
  channelId?: string;
  isSecretMessage?: boolean;
} | null;

export function extractPushNotification(
  l10n: any,
  { notification, data }: FirebaseMessagingTypes.RemoteMessage,
): PNMessageResult {
  const type: keyof typeof PUSH_NOTIFICATION_ACTIONS | undefined =
    data?.type as any;
  if (
    !type ||
    !Object.values(PUSH_NOTIFICATION_ACTIONS).find((x) => x === type)
  ) {
    return null;
  }

  const channelId = data?.channelId;

  if (!notification) {
    // handles silent push notifications
    const callMessage = l10n.videoCall.incoming;
    const callerName = data?.caller;
    const matchId = data?.matchId;
    if (type === 'INCOMING_VIDEO_CALL') {
      return {
        type,
        message: callMessage,
        description: callerName,
        matchId,
        channelId,
      };
    }
    if (type === 'VIDEO_CALL_CANCELLED') {
      return { type, channelId };
    }
    return null;
  }
  let description = notification.body;
  if (notification.bodyLocKey) {
    description = _get(l10n, notification.bodyLocKey);
  }
  if (notification.bodyLocArgs && notification.bodyLocArgs.length) {
    description = l10n.formatString(description, notification.bodyLocArgs[0]);
  }
  let message = notification.title;
  if (notification.titleLocKey) {
    message = _get(l10n, notification.titleLocKey);
  }
  const isSecretMessage = data?.isSecretMessage === 'true';
  if (!message) {
    if (description) {
      return {
        type,
        message: description,
        isSecretMessage,
      };
    } else {
      return null;
    }
  }
  return {
    type,
    message,
    channelId,
    description,
    isSecretMessage,
  };
}
