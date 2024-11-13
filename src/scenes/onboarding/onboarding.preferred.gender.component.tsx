import React, { useContext, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Picker, View } from 'react-native-ui-lib';
import { Formik } from 'formik';

import { OnboardingHeader } from '../../components/onboarding/onboarding.header.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import CustomPicker from '../../components/custom/styleguide-components/custom.picker.component';
import { Gender } from '@match-app/shared';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import { enumToArray } from '../../util/enumToArray';
import useProfileChangeSelector from '../profile/profile.change.selector';

import { appColors } from '../../style/appColors';
import styles from './style';
import OnboardingHeadline from '../../components/onboarding/onboarding.headline.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

export interface OnboardingPreferredGenderScreenProps {
  navigation: {
    back: () => void;
    next: () => void;
  };
}

export const OnboardingPreferredGenderScreen = (
  props: OnboardingPreferredGenderScreenProps,
) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);
  const savedCallback = () => {
    if (isInitial) {
      setIsInitial(false);
      logEvent(FunnelEvents.onBoardingLookingFor);
    }
  };
  const { initialValues, isSaving, handlePickerChange } =
    useProfileChangeSelector(savedCallback);
  const [isInitial, setIsInitial] = useState(
    !initialValues.preferredGender ||
      (Array.isArray(initialValues.preferredGender) &&
        initialValues.preferredGender.length === 0),
  );

  return (
    <View useSafeArea={true} style={styles.screen}>
      {isSaving && <DisableBackButton />}
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={() => {}}>
          {({ values, setFieldValue, errors }) => (
            <View style={styles.content}>
              <OnboardingHeader
                next={{
                  onPress: () => navigation.next(),
                  disabled: values.preferredGender?.length === 0 || isSaving,
                }}
                back={{
                  onPress: () => navigation.back(),
                  disabled: isSaving,
                }}
              />
              <Separator />
              <OnboardingHeadline />
              <View style={styles.section}>
                <CustomPicker
                  mode="MULTI"
                  label={l10n.profile.settings.form.preferredGender.title}
                  labelStyle={styles.title}
                  onChange={handlePickerChange(
                    'preferredGender',
                    setFieldValue,
                    errors.preferredGender,
                  )}
                  value={values.preferredGender || []}>
                  {enumToArray(Gender).map((gender) => (
                    <Picker.Item
                      key={gender}
                      value={Gender[gender as keyof typeof Gender]}
                      label={
                        l10n.profile.settings.form.preferredGender.options[
                          Gender[gender as keyof typeof Gender]
                        ]
                      }
                    />
                  ))}
                </CustomPicker>
              </View>
              <View style={styles.continueContainer}>
                {isSaving ? (
                  <ActivityIndicator color={appColors.primary} size={'small'} />
                ) : (
                  <CustomButton
                    style={styles.continueButton}
                    onPress={() => navigation.next()}
                    disabled={values.preferredGender?.length === 0}>
                    {l10n.onboarding.continue}
                  </CustomButton>
                )}
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};
