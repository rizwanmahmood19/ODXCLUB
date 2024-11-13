import moment from 'moment';

import { useContext, useState } from 'react';
import { PickerItemLabeledValue } from 'react-native-ui-lib/typings';

import { ProfileContext } from '../../states/profile.state';
import { useUpdateProfile } from './profile.selector';

import { profileValidationSchema as validationSchema } from '../../util/profileValidationSchema';
import { IUserProfile } from '@match-app/shared';
import { LocalizationContext } from '../../services/LocalizationContext';
import { ChatContext } from '../../states/chat.state';
import { Alert } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { FormikErrors } from 'formik';
import messaging from '@react-native-firebase/messaging';
import { useInitialProfile } from './useInitialProfile';

const useProfileChangeSelector = (
  savingCallback: () => void = () => undefined,
  savingErrorCallback: () => void = () => undefined,
) => {
  const { state, dispatch } = useContext(ProfileContext);
  const { setupPushNotifications, disablePushNotifications } =
    useContext(ChatContext);
  const { l10n } = useContext(LocalizationContext);
  const { updateProfile } = useUpdateProfile();

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const saveChanges = async (
    attribute: keyof IUserProfile,
    value: any,
    errors?: any,
  ) => {
    if (!errors) {
      dispatch({ type: 'setIsSaving', isSaving: true });
      await updateProfile({
        data: { [attribute]: extractValue(attribute, value) },
      });
      dispatch({ type: 'setIsSaving', isSaving: false });
      savingCallback();
    } else {
      savingErrorCallback();
    }
  };

  const handleTextFieldBlur = async (
    attribute: keyof IUserProfile,
    value?: string,
    errors?: any,
    validate?: (values?: any) => Promise<FormikErrors<any>>,
  ) => {
    if (validate) {
      validate().then(async (validationErrors) => {
        await saveChanges(attribute, value, validationErrors[attribute]);
      });
    } else {
      await saveChanges(attribute, value, errors);
    }
  };

  const handlePickerChange =
    (
      field: keyof IUserProfile,
      setFieldValue: (key: string, value: unknown) => void,
      errors?: any,
    ) =>
    (value: PickerItemLabeledValue | string[]) => {
      setFieldValue(field, value);
      if (
        field === 'preferredGender' &&
        Array.isArray(value) &&
        value.length === 0
      ) {
        dispatch({ type: 'setIsValid', isValid: false });
        return;
      }
      if (!state.isValid) {
        dispatch({ type: 'setIsValid', isValid: true });
      }
      saveChanges(field, value, errors);
    };

  const handleSearchRadiusChange =
    (setFieldValue: (key: string, value: unknown) => void) =>
    (value: number) => {
      setFieldValue('searchRadius', value);
    };

  const handleSearchRadiusChangeEnd = (value: number) => () => {
    saveChanges('searchRadius', value);
  };

  const handleAgeChange =
    (
      setFieldValue: (key: string, value: unknown) => void,
      currentFormValues: any,
    ) =>
    (values: number[]) => {
      if (currentFormValues.preferredAgeMin !== values[0]) {
        setFieldValue('preferredAgeMin', values[0]);
      }
      if (currentFormValues.preferredAgeMax !== values[1]) {
        setFieldValue('preferredAgeMax', values[1]);
      }
    };

  const handleAgeChangeEnd = (values: number[]) => {
    if (state.profile?.preferredAgeMin !== values[0]) {
      saveChanges('preferredAgeMin', values[0]);
    }
    if (state.profile?.preferredAgeMax !== values[1]) {
      saveChanges('preferredAgeMax', values[1]);
    }
  };

  const handleAllowsPassionAlertsChange = (allowsPassionAlerts: boolean) =>
    saveChanges('allowsPassionAlerts', allowsPassionAlerts);
  const handleAllowsPushNotificationsChange = async (
    allowsPushNotifications: boolean,
  ) => {
    if (allowsPushNotifications) {
      try {
        await messaging().requestPermission();
        await setupPushNotifications();
      } catch (e) {
        Sentry.captureException(e);
        Alert.alert(
          l10n.profile.settings.pn.failedEnableTitle,
          l10n.profile.settings.pn.text,
        );
      }
    } else {
      try {
        await disablePushNotifications();
      } catch (e) {
        Sentry.captureException(e);
        Alert.alert(
          l10n.profile.settings.pn.failedDisableTitle,
          l10n.profile.settings.pn.text,
        );
      }
    }

    return saveChanges('allowsPushNotifications', allowsPushNotifications);
  };

  const handleScrollEnabled = (enabled: boolean) => {
    setScrollEnabled(enabled);
  };

  const extractValue = (attribute: string, value: any) => {
    switch (attribute) {
      case 'birthday':
        return moment(value).format('YYYY-MM-DD');
      case 'gender':
      case 'relationshipStatus':
      case 'height':
        return value.value;
      default:
        return value;
    }
  };

  const initialValues = useInitialProfile(state.profile);

  return {
    initialValues,
    validationSchema,
    isSaving: state.isSaving,
    isPictureUploaded: state.profile?.pictures
      ? state.profile.pictures.length > 0
      : false,
    scrollEnabled,
    handleTextFieldBlur,
    handleAllowsPassionAlertsChange,
    handleAllowsPushNotificationsChange,
    handlePickerChange,
    handleAgeChange,
    handleAgeChangeEnd,
    handleSearchRadiusChange,
    handleSearchRadiusChangeEnd,
    handleScrollEnabled,
  };
};

export default useProfileChangeSelector;
