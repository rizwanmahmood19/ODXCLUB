import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native-ui-lib';
import styles from './style';
import { OnboardingHeader } from '../../components/onboarding/onboarding.header.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import ProfileGrid from '../../components/profile-edit/profile.grid.component';
import useProfileChangeSelector from '../profile/profile.change.selector';
import { ActivityIndicator, ScrollView } from 'react-native';
import { appColors } from '../../style/appColors';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import OnboardingHeadline from '../../components/onboarding/onboarding.headline.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

export interface OnboardingPicturesScreenProps {
  navigation: {
    back: () => void;
    next: () => void;
    onPhotoSelect: (photoUrl: { base64: string; path?: string }) => void;
  };
}

export const OnboardingPicturesScreen = (
  props: OnboardingPicturesScreenProps,
) => {
  const { navigation } = props;
  const { l10n } = useContext(LocalizationContext);
  const {
    initialValues,
    isSaving,
    isPictureUploaded,
    scrollEnabled,
    handleScrollEnabled,
  } = useProfileChangeSelector();
  const [isInitial, setIsInitial] = useState(
    initialValues.pictures.length === 0,
  );
  useEffect(() => {
    if (isInitial && initialValues.pictures.length > 0) {
      logEvent(FunnelEvents.onBoardingPhotos);
      setIsInitial(false);
    }
  }, [isInitial, initialValues.pictures.length]);
  return (
    <View useSafeArea={true} style={styles.screen}>
      {isSaving && <DisableBackButton />}
      <View style={styles.container}>
        <View style={styles.content}>
          <OnboardingHeader
            next={{
              onPress: () => navigation.next(),
              disabled: isSaving || !isPictureUploaded,
            }}
            back={{
              onPress: () => navigation.back(),
              disabled: isSaving,
            }}
          />
          <Separator />
          <ScrollView scrollEnabled={scrollEnabled}>
            <OnboardingHeadline />
            <View style={styles.sectionPictures}>
              <InfoText style={styles.continueHintText}>
                {l10n.onboarding.pictures.hint}
              </InfoText>
              <ProfileGrid
                onPhotoSelect={navigation.onPhotoSelect}
                images={initialValues.pictures}
                onScrollEnabled={handleScrollEnabled}
              />
            </View>
            <View style={[styles.continueContainer, styles.paddingTopZero]}>
              <InfoText style={styles.continueHintText}>
                {l10n.onboarding.pictures.required}
              </InfoText>
              {isSaving ? (
                <ActivityIndicator color={appColors.primary} size={'small'} />
              ) : (
                <CustomButton
                  style={styles.continueButton}
                  onPress={() => navigation.next()}
                  disabled={!!isSaving || !isPictureUploaded}>
                  {l10n.onboarding.continue}
                </CustomButton>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
