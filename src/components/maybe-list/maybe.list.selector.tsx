import { useAxios } from '../../util/useAxios';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  IPublicProfile,
  SwipeDecision,
  MaybeEntry,
  MatchResult,
} from '@match-app/shared';
import { MaybeListContext } from '../../states/maybeList.state';
import { PortalContext } from '../../util/PortalContext';
import MatchNotificationToast from '../notifications/match.notification.toast.component';
import { AppRoute } from '../../navigation/app.routes';
import { LocalizationContext } from '../../services/LocalizationContext';
import { ChatContext } from '../../states/chat.state';

export const useMaybeListSelector = () => {
  const [decisionLoading, setDecisionLoading] = useState<string>();
  const [selectedEntry, setSelectedEntry] = useState<MaybeEntry>();
  const { refreshChatList } = useContext(ChatContext);
  const navigation = useNavigation();
  const { l10n } = useContext(LocalizationContext);
  const { teleport } = useContext(PortalContext);
  const { maybeList, isLoading, fetchMaybeList } = useContext(MaybeListContext);

  const openModal = (entry: MaybeEntry) => {
    setSelectedEntry(entry);
  };

  const closeModal = () => setSelectedEntry(undefined);

  const notificationTimeout = useRef<undefined | number>();
  const deleteNotification = () => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    teleport('new-match-toast', null);
  };
  const teleportNotification = (name: string) => {
    teleport(
      'new-match-toast',
      <MatchNotificationToast
        toast={{
          message: l10n.notification.match.title,
          description: l10n.formatString(l10n.notification.match.body, name),
          onNavigate: () => navigation.navigate(AppRoute.CONVERSATION),
        }}
        dismissToast={deleteNotification}
      />,
    );
    notificationTimeout.current = setTimeout(deleteNotification, 5000) as any;
  };

  const [{ error: decisionError }, postDecision] = useAxios<MatchResult>({
    method: 'POST',
    initial: false,
  });

  const onDecision =
    (profile: IPublicProfile) => async (decision: SwipeDecision) => {
      setDecisionLoading(profile.id);
      await postDecision({
        url: `/maybe-entries/${profile.id}`,
        data: {
          decision,
        },
      }).then(({ response: { data } }) => {
        setDecisionLoading(undefined);
        fetchMaybeList();
        if (data?.matchId) {
          teleportNotification(profile.name);
          refreshChatList();
        }
      });
    };

  useFocusEffect(
    useCallback(() => {
      fetchMaybeList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return {
    loading: isLoading,
    maybeList,
    selectedEntry,
    decisionError,
    decisionLoading,
    onDecision,
    openModal,
    closeModal,
  };
};
