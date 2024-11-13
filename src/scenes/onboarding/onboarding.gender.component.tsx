import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import { ActivityIndicator } from 'react-native';
import { Picker, View } from 'react-native-ui-lib';

import { OnboardingHeader } from '../../components/onboarding/onboarding.header.component';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import CustomPicker from '../../components/custom/styleguide-components/custom.picker.component';
import useProfileChangeSelector from '../profile/profile.change.selector';

import { LocalizationContext } from '../../services/LocalizationContext';

import { Gender } from '@match-app/shared';

import { appColors } from '../../style/appColors';
import styles from './style';
import OnboardingHeadline from '../../components/onboarding/onboarding.headline.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';
import { noop } from '../../util/noop';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

export interface OnboardingGenderScreenProps {
  navigation: {
    back: () => void;
    next: () => void;
  };
}

export const OnboardingGenderScreen = (props: OnboardingGenderScreenProps) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);
  const savedCallback = () => {
    if (isInitial) {
      setIsInitial(false);
      logEvent(FunnelEvents.onBoardingGender);
    }
  };

  const { initialValues, validationSchema, isSaving, handlePickerChange } =
    useProfileChangeSelector(savedCallback);

  const [isInitial, setIsInitial] = useState(!initialValues.gender.value);
  return (
    <View useSafeArea={true} style={styles.screen}>
      {isSaving && <DisableBackButton />}
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={noop}>
          {({ values, setFieldValue, errors }) => (
            <View style={styles.content}>
              <OnboardingHeader
                next={{
                  onPress: () => navigation.next(),
                  disabled: !values.gender?.value || isSaving,
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
                  label={l10n.profile.edit.form.gender.title}
                  labelStyle={styles.title}
                  onChange={handlePickerChange('gender', setFieldValue)}
                  style={errors.gender ? styles.error : undefined}
                  value={values.gender}>
                  {Object.keys(Gender).map((gdr: string) => (
                    <Picker.Item
                      key={gdr}
                      value={{
                        value: Gender[gdr],
                        label:
                          l10n.profile.edit.form.gender.options[Gender[gdr]],
                      }}
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
                    disabled={!values.gender.value}>
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
