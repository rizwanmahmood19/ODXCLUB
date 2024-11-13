import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';

import { Formik, FormikErrors } from 'formik';

import { OnboardingHeader } from '../../components/onboarding/onboarding.header.component';
import CustomTextField from '../../components/custom/styleguide-components/custom.text.field.component';
import AuthFooter from '../../components/auth/auth.footer.component';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import useProfileChangeSelector from '../profile/profile.change.selector';

import { LocalizationContext } from '../../services/LocalizationContext';

import { appColors } from '../../style/appColors';
import styles from './style';
import { useSignOut } from '../auth/useSignOut';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import OnboardingHeadline from '../../components/onboarding/onboarding.headline.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';
import { noop } from '../../util/noop';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

export interface OnboardingNameScreenProps {
  navigation: {
    next: () => void;
  };
}

export const OnboardingNameScreen = (props: OnboardingNameScreenProps) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);
  const { signOut, isSigningOut } = useSignOut();
  const [isSaving, setIsSaving] = useState(false);

  const savedCallback = () => {
    if (initialValues.name === '') {
      logEvent(FunnelEvents.onBoardingDisplayName);
    }
    navigation.next();
    setIsSaving(false);
    Keyboard.dismiss();
  };

  const errorCallback = () => {
    setIsSaving(false);
  };

  const handleSubmit =
    (
      value?: string,
      errors?: any,
      validate?: (values?: any) => Promise<FormikErrors<any>>,
    ) =>
    async (_event: any) => {
      setIsSaving(true);
      if (!isSaving) {
        await handleTextFieldBlur('name', value, errors, validate);
      }
    };

  const { initialValues, validationSchema, handleTextFieldBlur } =
    useProfileChangeSelector(savedCallback, errorCallback);

  return (
    <View useSafeArea={true} style={styles.screen}>
      {isSaving && <DisableBackButton />}
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          validateOnMount={false}
          onSubmit={noop}>
          {({ values, handleChange, errors, validateForm }) => (
            <View style={styles.content}>
              <View style={styles.keyboardAware}>
                <OnboardingHeader
                  next={{
                    onPress: handleSubmit(
                      values.name,
                      errors.name,
                      validateForm,
                    ),
                    disabled: values.name?.length === 0 || isSaving,
                  }}
                />
                <Separator />
                <OnboardingHeadline />
                <View style={styles.section}>
                  <KeyboardAvoidingView>
                    <CustomTextField
                      style={errors.name ? styles.error : undefined}
                      value={values.name}
                      label={l10n.profile.edit.form.DISPLAY_NAME}
                      labelStyle={
                        errors.name
                          ? [styles.errorTitle, styles.title]
                          : styles.title
                      }
                      maxLength={14}
                      onEndEditing={handleSubmit(
                        values.name,
                        errors.name,
                        validateForm,
                      )}
                      onChangeText={handleChange('name')}
                      onBlur={handleSubmit(
                        values.name,
                        errors.name,
                        validateForm,
                      )}
                    />
                  </KeyboardAvoidingView>
                </View>
              </View>
              <View style={styles.continueContainer}>
                <InfoText style={styles.continueHintText}>
                  {l10n.onboarding.name.hint}
                </InfoText>
                {isSaving ? (
                  <ActivityIndicator color={appColors.primary} size={'small'} />
                ) : (
                  <CustomButton
                    style={styles.continueButton}
                    onPress={handleSubmit(
                      values.name,
                      errors.name,
                      validateForm,
                    )}
                    disabled={values.name?.length === 0}>
                    {l10n.onboarding.continue}
                  </CustomButton>
                )}
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
      {isSigningOut ? (
        <ActivityIndicator color={appColors.primary} size={'small'} />
      ) : (
        <AuthFooter
          title={l10n.profile.settings.form.logout}
          onPress={() => signOut()}
        />
      )}
    </View>
  );
};
