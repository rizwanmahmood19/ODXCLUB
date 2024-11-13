import { useContext, useEffect } from 'react';
import { ProfileContext } from '../../states/profile.state';
import { AuthContext } from '../../states/auth.state';

import { useAppState } from '../app.state';
import { postOnlineStatus } from './onlineStatus';

export const useIsOnline = () => {
  const { appState } = useAppState();
  const authContext = useContext(AuthContext);
  const profileContext = useContext(ProfileContext);

  const updateOnlineStatus = async () => {
    if (profileContext.state.profile) {
      await postOnlineStatus(profileContext.state.profile.id);
    }
  };

  // update online status when app comes to foreground
  useEffect(() => {
    if (
      authContext.state.user &&
      (!authContext.state.user.email || authContext.state.user.emailVerified) &&
      appState === 'active'
    ) {
      updateOnlineStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  // update online status after sign in/up
  useEffect(() => {
    if (
      authContext.state.user &&
      (!authContext.state.user.email || authContext.state.user.emailVerified)
    ) {
      updateOnlineStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.state.user]);
};
