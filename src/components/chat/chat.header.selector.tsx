import { useEffect, useState } from 'react';
import { IPublicProfile } from '@match-app/shared';
import { useAxios } from '../../util/useAxios';
import { useNavigation } from '@react-navigation/core';
import { AppRoute } from '../../navigation/app.routes';

export const useChatHeaderSelector = (
  matchId?: string,
  otherMemberFirebaseId?: string,
) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const navigation = useNavigation();

  const openDetailsModal = () => setDetailsVisible(true);
  const closeDetailsModal = () => setDetailsVisible(false);
  const returnToConversation = () => navigation.navigate(AppRoute.CONVERSATION);

  const [{ data, loading }, getProfile] = useAxios<IPublicProfile>({
    method: 'GET',
  });

  useEffect(() => {
    if (matchId && otherMemberFirebaseId) {
      getProfile({
        url: `matching/matches/${matchId}/profile/${otherMemberFirebaseId}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, otherMemberFirebaseId]);

  return {
    loading,
    profile: data,
    detailsVisible,
    openDetailsModal,
    closeDetailsModal,
    returnToConversation,
  };
};
