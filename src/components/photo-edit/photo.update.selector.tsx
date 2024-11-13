import { useContext, useState } from 'react';

import { useAxios } from '../../util/useAxios';
import { useFetchProfile } from '../../scenes/profile/profile.selector';
import { Alert } from 'react-native';
import { LocalizationContext } from '../../services/LocalizationContext';
import { IProfilePicture } from '@match-app/shared';

export const usePhotoUpdateSelector = (
  image: IProfilePicture,
  goBack: () => void,
) => {
  const { l10n } = useContext(LocalizationContext);
  const [isBlurred, setIsBlurred] = useState(image.isBlurred);

  const handleSwitchChange = (value: boolean) => setIsBlurred(value);
  const { fetchProfile } = useFetchProfile();

  const [{ data, loading }, updatePicture] = useAxios({
    method: 'PUT',
    onError: (e) => {
      console.error(e);
      Alert.alert(
        l10n.profile.photoEdit.updateError.title,
        l10n.profile.photoEdit.updateError.description,
        [
          {
            text: l10n.profile.photoEdit.updateError.okay,
            onPress: () => goBack(),
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {
            goBack();
          },
        },
      );
    },
  });

  const updatePhoto = async () => {
    if (image.isBlurred !== isBlurred) {
      const config = {
        data: { isBlurred },
        url: `profile-picture/update/${image.id}`,
      };
      await updatePicture(config);
      await fetchProfile();
    }

    goBack();
  };

  return {
    isBlurred,
    isLoading: loading || data !== undefined,
    updatePhoto,
    handleSwitchChange,
  };
};
