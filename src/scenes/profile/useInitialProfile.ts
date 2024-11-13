import {
  IUserProfile,
  MIN_SEARCH_RADIUS,
  RelationshipStatus,
} from '@match-app/shared';
import { useContext, useMemo } from 'react';
import { LocalizationContext } from '../../services/LocalizationContext';

export function useInitialProfile(data: Partial<IUserProfile> | null) {
  const { l10n } = useContext(LocalizationContext);
  return useMemo(
    () => ({
      allowsPushNotifications: false,
      allowsPassionAlerts: false,
      preferredAgeMin: 18,
      preferredAgeMax: 99,
      searchRadius: MIN_SEARCH_RADIUS,
      ...data,
      birthday:
        data && data.birthday !== null ? new Date(data.birthday || '') : null,
      preferredPlaces: data && data.preferredPlaces,
      preferredGender: data && data.preferredGender,
      gender: {
        value: data && data.gender,
        label:
          (data?.gender &&
            l10n.profile.edit.form.gender.options[data.gender]) ||
          data?.gender,
      },
      relationshipStatus: {
        value: data && data.relationshipStatus,
        label:
          (data &&
            l10n.profile.edit.form.relationshipStatus.options[
              data.relationshipStatus as RelationshipStatus
            ]) ||
          data?.relationshipStatus,
      },
      height: {
        label: `${data?.height} cm`,
        value: data?.height,
      },
      pictures: data?.pictures || [],
    }),
    [data, l10n],
  );
}
