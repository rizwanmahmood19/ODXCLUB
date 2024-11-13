import { useUpdateProfile } from '../../scenes/profile/profile.selector';
import { Location } from './currentPosition';

export const useSendLocation = () => {
  const { updateProfile, isUpdating } = useUpdateProfile();

  const sendLocationToExternal = async (newPosition: Location) => {
    // GeoJson format is [lon, lat], see https://tools.ietf.org/html/rfc7946
    return await updateProfile({
      data: {
        lastLocation: {
          type: 'Point',
          coordinates: [newPosition.lon, newPosition.lat],
        },
      },
    });
  };

  return {
    isUpdating,
    sendLocationToExternal,
  };
};
