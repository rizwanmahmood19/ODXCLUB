import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export function extractChannelId(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  const channel = message?.data?.channel;
  if (!channel) {
    return undefined;
  }
  try {
    return JSON.parse(channel).id;
  } catch (e) {
    return undefined;
  }
}
