import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StreamChat } from 'stream-chat';
import { useChatTokenSelector } from '../components/chat/chat.token.selector';
import messaging from '@react-native-firebase/messaging';
import env from '../../env.json';
import { AuthContext } from './auth.state';
import { ProfileContext } from './profile.state';
import * as Sentry from '@sentry/react-native';
import { is_iOS } from '../util/osCheck';
import logEvent from '../analytics/analytics';
import {
  UserInteractionEvent,
  VideoCallEvent,
} from '../analytics/analytics.event';
import { hasVideoPermission } from '../services/permission/permission';
import { MaybeListContext } from './maybeList.state';
import { useAppState } from '../services/app.state';

const client = new StreamChat(env.STREAM_IO_APP_KEY, { timeout: 15000 });

interface ChatContextTypes {
  client: StreamChat;
  isLoading: boolean;
  setupPushNotifications: () => Promise<void>;
  disablePushNotifications: () => Promise<void>;
  error: Error | undefined;
  resetClient: () => void;
  refreshChatList: () => void;
  registerRefresh: (refresh: () => void) => void;
  reset: () => void;
  isVideoModalOpen: boolean;
  openVideoModal: () => void;
  closeVideoModal: () => void;
  isCaller: boolean;
  joinVideoCall: () => void;
  reconnect: () => Promise<void>;
  hasUnreadChannels: boolean;
  queryAndSetUnreadChannels: () => void;
}

const ChatContext = createContext<ChatContextTypes>({
  client: client,
  isLoading: true,
  error: undefined,
  resetClient: () => undefined,
  refreshChatList: () => console.debug('refreshChatList not implemented yet'),
  registerRefresh: () => undefined,
  setupPushNotifications: () => Promise.resolve(),
  disablePushNotifications: () => Promise.resolve(),
  reset: () => undefined,
  isVideoModalOpen: false,
  openVideoModal: () => undefined,
  closeVideoModal: () => undefined,
  isCaller: true,
  joinVideoCall: () => undefined,
  reconnect: () => Promise.resolve(),
  hasUnreadChannels: false,
  queryAndSetUnreadChannels: () => undefined,
});

const ChatProvider: React.FC = ({ children }) => {
  const { fetchToken } = useChatTokenSelector();
  const { state } = useContext(AuthContext);
  const {
    state: { profile },
  } = useContext(ProfileContext);

  const [isLoading, setIsLoading] = useState(true);
  const [initialTokenHandled, setInitialTokenHandled] = useState(false);
  const refreshChatList = useRef<(() => void) | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [cachedToken, setCachedToken] = useState<string>();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCaller, setIsCaller] = useState(true);
  const [hasUnreadChannels, setHasUnreadChannels] = useState(false);
  const { fetchMaybeList } = useContext(MaybeListContext);

  useAppState({ onForeground: () => queryAndSetUnreadChannels() });

  useEffect(() => {
    const handleNewMessageNotification = (event: any) => {
      if (
        event.unread_channels !== undefined &&
        event.message &&
        !event.message.isSecretMessage
      ) {
        setHasUnreadChannels(true);
      }
      if (event.message && event.message.isSecretMessage) {
        fetchMaybeList();
        queryAndSetUnreadChannels();
      }
    };

    client.on('notification.message_new', handleNewMessageNotification);
    client.on('message.new', handleNewMessageNotification);
    client.on('notification.mark_read', () => queryAndSetUnreadChannels());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryAndSetUnreadChannels = async () => {
    if (client.user) {
      const channels = await client.queryChannels(
        {
          type: 'messaging',
          hidden: false,
          secretMessage: { $ne: true }, // Only return channels that are not secret messages
        },
        { unread_count: -1 },
        { watch: false, limit: 1 },
      );
      if (channels.length > 0) {
        setHasUnreadChannels(channels[0].countUnread() > 0);
      }
    }
  };

  const setupPushNotifications = async () => {
    if (!(await messaging().hasPermission())) {
      return;
    }
    const token = is_iOS
      ? await messaging().getAPNSToken()
      : await messaging().getToken();

    if (!token) {
      console.error('No apns token found!');
      return;
    }

    if (cachedToken !== token) {
      setInitialTokenHandled(true);
      setCachedToken(token);
      await client.addDevice(token, is_iOS ? 'apn' : 'firebase');
    }
  };

  const disablePushNotifications = async () => {
    try {
      const { devices } = await client.getDevices();
      if (Array.isArray(devices)) {
        await Promise.all(
          devices.map(async (device) => {
            if (device.id) {
              try {
                await client.removeDevice(device.id);
              } catch (e) {
                Sentry.captureException(e, {
                  extra: { problem: 'FAILED TO REMOVE DEVICE FROM CLIENT.' },
                });
              }
            }
          }),
        );
      }
    } catch (e) {
      Sentry.captureException(e, {
        extra: { problem: 'FAILED TO GET DEVICES FROM CLIENT.' },
      });
    }

    setCachedToken(undefined);
  };

  const openVideoModal = async () => {
    logEvent(UserInteractionEvent.click + '_' + VideoCallEvent.initiate);
    setIsVideoModalOpen(await hasVideoPermission());
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setIsCaller(true);
  };
  const joinVideoCall = () => {
    setIsCaller(false);
    openVideoModal();
  };

  useEffect(() => {
    if (
      !initialTokenHandled &&
      profile &&
      profile.allowsPushNotifications &&
      profile.firebaseDeviceToken &&
      client.user
    ) {
      setupPushNotifications();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, initialTokenHandled, client.user]);

  const initializeChat = async () => {
    setIsLoading(true);
    setError(undefined);
    if (
      state.user &&
      (state.user.phoneNumber || (state.user.email && state.user.emailVerified))
    ) {
      const chatToken = await fetchToken();
      if (chatToken) {
        try {
          await client.disconnectUser();
          await client.connectUser({ id: state.user.uid }, chatToken);
          setIsLoading(false);
          queryAndSetUnreadChannels();
        } catch (err) {
          Sentry.captureException(err, {
            extra: { problem: 'FAILED TO INITIALIZE CHAT' },
          });
          console.error(err);
          await client.disconnectUser();
          setIsLoading(false);
          setError(new Error('Client could not be initialized.'));
        }
      } else {
        setError(new Error('Client could not be initialized.'));
        setIsLoading(false);
      }
    } else {
      await client.disconnectUser();
    }
  };

  const reconnect = async () => {
    if (!client.wsConnection?.isHealthy) {
      await initializeChat();
    }
  };

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user?.uid]);

  return (
    <ChatContext.Provider
      value={{
        setupPushNotifications,
        disablePushNotifications,
        client: client,
        isLoading: isLoading,
        error: error,
        resetClient: initializeChat,
        refreshChatList: () => {
          if (typeof refreshChatList.current === 'function') {
            refreshChatList.current();
          }
        },
        registerRefresh: (func) => {
          refreshChatList.current = func;
        },
        reset: () => {
          setInitialTokenHandled(false);
        },
        isVideoModalOpen: isVideoModalOpen,
        openVideoModal,
        closeVideoModal,
        isCaller,
        joinVideoCall,
        reconnect,
        hasUnreadChannels,
        queryAndSetUnreadChannels,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
