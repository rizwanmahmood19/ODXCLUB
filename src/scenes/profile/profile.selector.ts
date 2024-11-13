import { useContext } from 'react';
import { ProfileContext } from '../../states/profile.state';
import { useAxios, UseAxiosConfig } from '../../util/useAxios';
import { IProfilePicture, IUserProfile } from '@match-app/shared';
import { AppsFlyerEvents } from '../../analytics/appsflyer.analytics';
import { TrackingContext } from '../../analytics/tracking.context';
import { currentUser } from '../../services/authentication';
import { AuthContext } from '../../states/auth.state';
import { ImageCheckContext } from '../../states/imageCheck.state';
import { Alert } from 'react-native';
import { LocalizationContext } from '../../services/LocalizationContext';

export const useCreateProfile = () => {
  const { logAppsFlyerEvent } = useContext(TrackingContext);
  const [, createProfile] = useAxios({
    url: 'profile',
    method: 'POST',
    initial: false,
    onSuccess: () => logAppsFlyerEvent(AppsFlyerEvents.RegistrationInitiated),
  });

  return { createProfile };
};

export const useFetchProfile = ({
  onSuccess,
  ...config
}: UseAxiosConfig = {}) => {
  const profileContext = useContext(ProfileContext);
  const authContext = useContext(AuthContext);
  const imageCheckContext = useContext(ImageCheckContext);
  const { l10n } = useContext(LocalizationContext);

  const verifyPictures = (pictures: IProfilePicture[]) => {
    imageCheckContext.state.images.forEach((image) => {
      const returnedImage = pictures.find((pic) => pic.id === image);
      if (!returnedImage) {
        Alert.alert(l10n.notification.picture.rejected.title);
        imageCheckContext.dispatch({ type: 'reset' });
      } else {
        if (returnedImage.ready) {
          imageCheckContext.dispatch({
            type: 'removeImage',
            imageId: returnedImage.id,
          });
        }
      }
    });
  };

  const [{ loading, error }, fetchProfile] = useAxios<IUserProfile>({
    url: 'profile/me',
    method: 'GET',
    initial: false,
    onError: (e) => console.error(e.response?.data),
    onSuccess: (response) => {
      const { data } = response;
      if (data) {
        const pictures = [...data.pictures];
        verifyPictures(pictures);
        pictures.sort((a, b) => a.index - b.index);
        profileContext.dispatch({
          type: 'setProfile',
          profile: {
            ...data,
            pictures,
          },
        });
        authContext.dispatch({ type: 'setUser', user: currentUser() });
      }
      onSuccess?.(response);
    },
    ...config,
  });

  return { fetchProfile, loading, error };
};

export const useUpdateProfile = () => {
  const { state, dispatch } = useContext(ProfileContext);
  const [{ loading: isUpdating }, updateProfile] = useAxios({
    method: 'PATCH',
    url: 'profile',
    onSuccess: ({ data }) => {
      dispatch({
        type: 'setProfile',
        profile: { ...state.profile, ...data },
      });
    },
  });

  return { updateProfile, isUpdating };
};

export const useDeleteProfile = () => {
  const [, deleteProfile] = useAxios({
    method: 'DELETE',
    url: 'profile',
  });

  return { deleteProfile };
};
