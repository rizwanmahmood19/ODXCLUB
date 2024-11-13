import {
  useDeleteProfile,
  useUpdateProfile,
} from '../profile/profile.selector';
import { useContext, useState } from 'react';
import { clearUserData } from '../../services/clearUserData';
import {
  currentUser,
  signOut as firebaseSignOut,
} from '../../services/authentication';
import { AuthContext } from '../../states/auth.state';
import { ProfileContext } from '../../states/profile.state';
import { TokenContext } from '../../states/token.state';
import { ChatContext } from '../../states/chat.state';

export const useSignOut = () => {
  const { dispatch: dispatchAuth } = useContext(AuthContext);
  const { dispatch: dispatchToken } = useContext(TokenContext);
  const profileContext = useContext(ProfileContext);
  const chatContext = useContext(ChatContext);
  const {
    state: { profile },
  } = useContext(ProfileContext);
  const { updateProfile } = useUpdateProfile();
  const { deleteProfile } = useDeleteProfile();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async (withDeletion = false) => {
    setIsSigningOut(true);
    try {
      await chatContext.disablePushNotifications();

      if (profile) {
        await updateProfile({
          data: { firebaseDeviceToken: null },
        });
      }

      if (withDeletion) {
        await deleteProfile().then(() => {
          profileContext.dispatch({
            type: 'setProfile',
            profile: null,
          });
        });
      }

      try {
        await clearUserData();
      } catch (e) {
        console.error(e);
      }

      setIsSigningOut(false);
      await firebaseSignOut();
      chatContext.reset();
      dispatchAuth({ type: 'setUser', user: currentUser() });
      dispatchToken({ type: 'setToken', token: '' });
      profileContext.dispatch({ type: 'setProfile', profile: null });
    } catch (e) {
      console.error(e);
      setIsSigningOut(false);
      throw e;
    }
  };

  return { isSigningOut, signOut };
};
