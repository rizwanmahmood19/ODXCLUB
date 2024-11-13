import React, { useContext, useEffect, useRef, useState } from 'react';
import * as navigation from '../services/navigate';
import messaging from '@react-native-firebase/messaging';
import { AppRoute } from '../navigation/app.routes';
import {
  extractPushNotification,
  PNMessageResult,
} from './extractPushNotification';
import { LocalizationContext } from '../services/LocalizationContext';
import { PUSH_NOTIFICATION_ACTIONS } from '@match-app/shared';
import { useAxios } from './useAxios';
import { ChatContext } from '../states/chat.state';
import { PortalContext } from './PortalContext';
import IncomingCallToast from '../components/notifications/incoming.call.toast.component';
import MatchNotificationToast from '../components/notifications/match.notification.toast.component';
import { MatchListContext } from '../states/matchList.state';
import { setIdleTimerDisabled } from 'react-native-idle-timer';
import { InitialRouteContext } from '../states/initialRoute.state';

export interface IMatchNotificationToast {
  message?: string;
  description?: string;
  onNavigate?: () => void;
}

export interface IIncomingCallToast {
  message?: string;
  description?: string;
  matchId?: string;
  channelId?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

const useNotifications = () => {
  const { l10n } = useContext(LocalizationContext);
  const { client, joinVideoCall, refreshChatList, reconnect } =
    useContext(ChatContext);

  const { fetchNewMatches } = useContext(MatchListContext);
  const { queryAndSetUnreadChannels } = useContext(ChatContext);
  const { setAppReadyRoute, setHomeInitialRoute } =
    useContext(InitialRouteContext);
  const [matchNotificationToast, setMatchNotificationToast] =
    useState<IMatchNotificationToast>({
      message: '',
    });
  const [incomingCallToast, setIncomingCallToast] =
    useState<IIncomingCallToast>({
      message: '',
    });

  const { teleport } = useContext(PortalContext);

  const handleForegroundNotifications = (pn: PNMessageResult) => {
    switch (pn?.type) {
      case PUSH_NOTIFICATION_ACTIONS.OPEN_MATCHES:
        handleForegroundMatchNotification(pn);
        break;
      case PUSH_NOTIFICATION_ACTIONS.INCOMING_VIDEO_CALL:
        handleCallNotification(pn);
        break;
      case PUSH_NOTIFICATION_ACTIONS.VIDEO_CALL_CANCELLED:
        handleCallCancel(pn);
        break;
      default:
        break;
    }
  };

  const handleInitialNotifications = (pn: PNMessageResult) => {
    switch (pn?.type) {
      case PUSH_NOTIFICATION_ACTIONS.OPEN_MATCHES:
        setHomeInitialRoute(AppRoute.CONVERSATION);
        break;
      case PUSH_NOTIFICATION_ACTIONS.NEW_MESSAGE:
        handleNewMessageBackground(pn, true);
        break;
      default:
        break;
    }
  };

  const handleBackgroundNotifications = (pn: PNMessageResult) => {
    switch (pn?.type) {
      case PUSH_NOTIFICATION_ACTIONS.OPEN_MATCHES:
        navigation.navigate(AppRoute.CONVERSATION);
        break;
      case PUSH_NOTIFICATION_ACTIONS.NEW_MESSAGE:
        handleNewMessageBackground(pn);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // handle notifications while app is open
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      handleForegroundNotifications(
        extractPushNotification(l10n, remoteMessage),
      );
    });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('onNotificationOpenedApp', remoteMessage);
      await reconnect();
      handleBackgroundNotifications(
        extractPushNotification(l10n, remoteMessage),
      );
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!remoteMessage) {
          return;
        }
        handleInitialNotifications(
          extractPushNotification(l10n, remoteMessage),
        );
      });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matchNotificationTimeout = useRef<undefined | number>();
  const callNotificationTimeout = useRef<undefined | number>();

  const deleteMatchNotification = () => {
    if (matchNotificationTimeout.current) {
      clearTimeout(matchNotificationTimeout.current);
    }
    teleport('new-match-toast', null);
  };

  const deleteCallNotification = () => {
    if (callNotificationTimeout.current) {
      clearTimeout(callNotificationTimeout.current);
    }
    teleport('incoming-call-toast', null);
    setIdleTimerDisabled(false);
  };

  const handleForegroundMatchNotification = (pn: PNMessageResult) => {
    const toast = {
      ...pn,
      onNavigate: () => navigation.navigate(AppRoute.CONVERSATION),
    };

    // if it was a secret message we need to reload the channel list
    if (pn?.isSecretMessage) {
      refreshChatList();
      toast.description = l10n.notification.match.secretMessage;
    }
    queryAndSetUnreadChannels();
    fetchNewMatches();
    setMatchNotificationToast(toast);
  };

  const [, cancelCall] = useAxios({
    method: 'GET',
    initial: false,
  });

  const handleCallNotification = (pn: PNMessageResult) => {
    setIncomingCallToast({
      ...pn,
      onAccept: () => {
        navigation.navigate(AppRoute.CHAT, {
          channelId: pn?.channelId,
        });
        joinVideoCall();
      },
      onReject: () => {
        cancelCall({
          url: `video-call/cancel/${pn?.matchId}`,
        })
          .then(() => {
            // send video info message. need channel
            // get channel from id
            return client.queryChannels({ id: pn?.channelId });
          })
          .then((channels) => {
            if (channels.length) {
              return channels[0].sendMessage({
                text: ' ',
                info: 'declined-call',
                isVideoInfoMessage: true,
              });
            } else {
              throw new Error('No channels matching ID');
            }
          })
          .catch((err) => {
            console.log('Error rejecting incoming call: ', err);
          });
      },
    });
  };

  const handleNewMessageBackground = (
    pn: PNMessageResult,
    isInitial = false,
  ) => {
    if (!pn?.channelId) {
      return;
    }
    const channel = client.channel(pn?.channelId);
    if (!channel) {
      return;
    }

    if (channel.data?.secretMessage) {
      if (isInitial) {
        setAppReadyRoute({ name: AppRoute.HOME });
        setHomeInitialRoute(AppRoute.MAYBE);
      } else {
        navigation.navigate(AppRoute.MAYBE);
      }
    } else {
      if (isInitial) {
        setAppReadyRoute({
          name: AppRoute.CHAT,
          params: {
            channelId: pn.channelId,
            navigateOnGoBack: isInitial,
          },
        });
      } else {
        navigation.navigate(AppRoute.CHAT, { channelId: pn.channelId });
      }
    }
  };

  useEffect(() => {
    if (!matchNotificationToast.message) {
      return;
    }
    teleport(
      'new-match-toast',
      <MatchNotificationToast
        toast={matchNotificationToast}
        dismissToast={deleteMatchNotification}
      />,
    );
    matchNotificationTimeout.current = setTimeout(
      deleteMatchNotification,
      5000,
    ) as any;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchNotificationToast]);

  useEffect(() => {
    if (!incomingCallToast.message) {
      return;
    }
    setIdleTimerDisabled(true);
    teleport(
      'incoming-call-toast',
      <IncomingCallToast
        toast={incomingCallToast}
        dismissToast={deleteCallNotification}
      />,
    );
    callNotificationTimeout.current = setTimeout(
      deleteCallNotification,
      29000,
    ) as any;

    return () => setIdleTimerDisabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingCallToast]);

  const handleCallCancel = (pn: PNMessageResult) => {
    // only dismiss if cancel push comes from same matchId as in toast
    if (pn?.matchId === incomingCallToast.matchId) {
      deleteCallNotification();
    }
  };
};

export default useNotifications;
