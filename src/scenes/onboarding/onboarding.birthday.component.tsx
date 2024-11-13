import React, { useContext, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { View } from 'react-native-ui-lib';

import { Formik } from 'formik';

import { OnboardingHeader } from '../../components/onboarding/onboarding.header.component';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import CustomAgePicker from '../../components/custom/custom.age.picker.component';
import CustomErrorText from '../../components/custom/custom.error.text.component';
import useProfileChangeSelector from '../profile/profile.change.selector';
import { LocalizationContext } from '../../services/LocalizationContext';

import { appColors } from '../../style/appColors';
import styles from './style';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import OnboardingHeadline from '../../components/onboarding/onboarding.headline.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';
import { noop } from '../../util/noop';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

export interface OnboardingBirthdayScreenProps {
  navigation: {
    back: () => void;
    next: () => void;
  };
}

export const OnboardingBirthdayScreen = (
  props: OnboardingBirthdayScreenProps,
) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);

  const savedCallback = () => {
    if (isInitial) {
      setIsInitial(false);
      logEvent(FunnelEvents.onBoardingAge);
    }
  };
  const { initialValues, validationSchema, isSaving, handlePickerChange } =
    useProfileChangeSelector(savedCallback);
  const [isInitial, setIsInitial] = useState(!initialValues.birthday);

  return (
    <View useSafeArea={true} style={styles.screen}>
      {isSaving && <DisableBackButton />}
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          initialErrors={{
            birthday: false,
          }}
          validateOnMount={false}
          onSubmit={noop}>
          {({ values, setFieldValue, errors }) => (
            <View style={styles.content}>
              <OnboardingHeader
                next={{
                  onPress: () => navigation.next(),
                  disabled: !values.birthday || !!errors.birthday || isSaving,
                }}
                back={{
                  onPress: () => navigation.back(),
                  disabled: isSaving,
                }}
              />
              <Separator />
              <OnboardingHeadline />
              <View style={styles.section}>
                <CustomAgePicker
                  label={l10n.profile.edit.form.AGE}
                  labelStyle={
                    errors.birthday
                      ? [styles.errorTitle, styles.title]
                      : styles.title
                  }
                  value={values.birthday}
                  style={errors.birthday ? styles.error : undefined}
                  onChange={handlePickerChange('birthday', setFieldValue)}
                  dateFormat="DD.MM.YYYY"
                  placeholder={
                    l10n.profile.edit.form.BIRTHDAY_PICKER_PLACEHOLDER
                  }
                />
              </View>
              <View style={styles.continueContainer}>
                {!!values.birthday && !!errors.birthday && (
                  <CustomErrorText
                    style={styles.errorTextContainer}
                    description={l10n.onboarding.birthday.error}
                  />
                )}
                <InfoText style={styles.continueHintText}>
                  {l10n.onboarding.birthday.hint}
                </InfoText>
                {isSaving ? (
                  <ActivityIndicator color={appColors.primary} size={'small'} />
                ) : (
                  <CustomButton
                    style={styles.continueButton}
                    onPress={() => navigation.next()}
                    disabled={!values.birthday || !!errors.birthday}>
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
