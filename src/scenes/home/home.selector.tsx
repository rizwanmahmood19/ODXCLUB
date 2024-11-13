import { useCallback, useContext, useEffect } from 'react';
import { useFetchProfile, useUpdateProfile } from '../profile/profile.selector';
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect } from '@react-navigation/native';
import { ProfileContext } from '../../states/profile.state';
import * as Sentry from '@sentry/react-native';
import { MaybeListContext } from '../../states/maybeList.state';
import { MatchListContext } from '../../states/matchList.state';
import { useAppState } from '../../services/app.state';

const useHomeSelector = () => {
  const {
    state: { profile },
  } = useContext(ProfileContext);
  const { fetchProfile } = useFetchProfile();

  useAppState({ onForeground: async () => await fetchProfile() });

  const { updateProfile } = useUpdateProfile();

  const saveDeviceToken = async (deviceToken: string) => {
    if (!profile || deviceToken !== profile.firebaseDeviceToken) {
      await updateProfile({
        data: { firebaseDeviceToken: deviceToken },
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const deviceTokenListener = async () => {
        const authorizationStatus = await messaging().hasPermission();

        if (
          authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
          try {
            // resolves immediately if device already registered
            await messaging().registerDeviceForRemoteMessages();
            messaging()
              .getToken()
              .then((token) => {
                return saveDeviceToken(token);
              });

            // Listen to whether the token changes
            return messaging().onTokenRefresh((token) => {
              saveDeviceToken(token);
            });
          } catch (error) {
            console.error(error);
            Sentry.captureException(error);
            return;
          }
        }
        return;
      };

      deviceTokenListener();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const { fetchMaybeList } = useContext(MaybeListContext);
  const { fetchNewMatches } = useContext(MatchListContext);

  useEffect(() => {
    fetchMaybeList();
    fetchNewMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useHomeSelector;
