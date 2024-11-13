import { useContext } from 'react';
import moment from 'moment';

import { ProfileContext } from '../../states/profile.state';

export const useProfilePreviewSelector = () => {
  const { state } = useContext(ProfileContext);

  return {
    profile: state.profile
      ? {
          id: state.profile?.id,
          name: state.profile?.name,
          gender: state.profile?.gender,
          place: state.profile?.place,
          preferredPlaces: state.profile?.preferredPlaces,
          description: state.profile?.description,
          relationshipStatus: state.profile?.relationshipStatus,
          height: state.profile?.height,
          distance: '< 1 km',
          age: moment()
            .diff(moment(state.profile?.birthday), 'years')
            .toString(),
          pictures: state.profile?.pictures.map((image) => {
            return {
              url: image.isBlurred ? image.blurredPictureUrl : image.pictureUrl,
              thumbnailUrl: image.isBlurred
                ? image.blurredThumbnailUrl
                : image.thumbnailUrl,
              isBlurred: image.isBlurred,
            };
          }),
        }
      : undefined,
  };
};
