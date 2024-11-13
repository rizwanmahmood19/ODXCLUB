import React, { useContext } from 'react';
import { View } from 'react-native-ui-lib';
import styles from './style';
import { OnboardingHeader } from '../../components/onboarding/onboarding.header.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import useProfileChangeSelector from '../profile/profile.change.selector';
import { Formik } from 'formik';
import { appColors } from '../../style/appColors';
import { ActivityIndicator } from 'react-native';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import CustomMultiSlider from '../../components/custom/styleguide-components/custom.multi.slider';
import { USER_MAX_AGE, USER_MIN_AGE } from '@match-app/shared';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import OnboardingHeadline from '../../components/onboarding/onboarding.headline.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';
import { noop } from '../../util/noop';

export interface OnboardingSearchSettingsScreenProps {
  navigation: {
    back: () => void;
    next: () => void;
  };
}

export const OnboardingSearchSettingsScreen = (
  props: OnboardingSearchSettingsScreenProps,
) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);

  const {
    initialValues,
    validationSchema,
    isSaving,
    handleAgeChange,
    handleAgeChangeEnd,
  } = useProfileChangeSelector();

  return (
    <View useSafeArea={true} style={styles.screen}>
      {isSaving && <DisableBackButton />}
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={noop}>
          {({ values, setFieldValue, isValid }) => (
            <View style={styles.content}>
              <OnboardingHeader
                next={{
                  onPress: () => navigation.next(),
                  disabled: !isValid || isSaving,
                }}
                back={{
                  onPress: () => navigation.back(),
                  disabled: isSaving,
                }}
              />
              <Separator />
              <OnboardingHeadline />
              <View style={styles.sectionSearchSettings}>
                <View style={styles.splitTitle}>
                  <InfoText style={styles.titleA}>
                    {l10n.profile.settings.form.age}
                  </InfoText>
                  <InfoText style={styles.titleRight}>
                    {`${values.preferredAgeMin} - ${values.preferredAgeMax}`}
                  </InfoText>
                </View>
                <CustomMultiSlider
                  min={USER_MIN_AGE}
                  max={USER_MAX_AGE}
                  values={[values.preferredAgeMin, values.preferredAgeMax]}
                  onValuesChange={handleAgeChange(setFieldValue, values)}
                  onValuesChangeFinish={handleAgeChangeEnd}
                />
              </View>
              <View style={styles.continueContainer}>
                {isSaving ? (
                  <ActivityIndicator color={appColors.primary} size={'small'} />
                ) : (
                  <CustomButton
                    style={styles.continueButton}
                    onPress={() => navigation.next()}
                    disabled={!isValid}>
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
