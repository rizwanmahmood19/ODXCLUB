import { useContext, useState } from 'react';
import {
  currentUser,
  sendEmailVerification,
  signUp as externalSignUp,
} from '../../services/authentication';

import { useCreateProfile } from '../profile/profile.selector';
import { AuthContext } from '../../states/auth.state';
import { AxiosError } from 'axios';
import { ProfileContext } from '../../states/profile.state';
import { TrackingContext } from '../../analytics/tracking.context';

export const useSignUp = () => {
  const { createProfile } = useCreateProfile();
  const { dispatch } = useContext(AuthContext);
  const profileContext = useContext(ProfileContext);
  const { initialTosAgreeId, resetInitialTosAgree } =
    useContext(TrackingContext);

  const [isSigningUp, setIsSigningUp] = useState(false);

  const cancelSignUp = async () => {
    await currentUser()?.delete();
    setIsSigningUp(false);
  };

  const signUp = async (
    email: string,
    password: string,
  ): Promise<AxiosError | Error | string | void> => {
    setIsSigningUp(true);
    try {
      await externalSignUp(email, password);
      const { error, response } = await createProfile({
        data: { initialTosAgreeId },
      });
      if (error) {
        console.error(error.response);
        // the initial tos agree id sent to the backend could not be found
        if (error.response?.status === 404) {
          // this redirects the application to the tos agree screen
          await resetInitialTosAgree();
          return;
        }
        await cancelSignUp();
        return error;
      }
      profileContext.dispatch({
        type: 'setProfile',
        profile: response.data,
      });
      await sendEmailVerification();
      setIsSigningUp(false);
      dispatch({ type: 'setUser', user: currentUser() });
    } catch (e) {
      console.error(e);
      cancelSignUp();
      return e;
    }
  };

  return { isSigningUp, signUp };
};
