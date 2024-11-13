import React, { useContext, useState } from 'react';
import { View } from 'react-native-ui-lib';
import styles from '../style';
import { LocalizationContext } from '../../../services/LocalizationContext';
import { OnboardingHeader } from '../../../components/onboarding/onboarding.header.component';
import LogoIcon from '../../../../assets/icons/matchapp_ic_logo.svg';
import { ActivityIndicator } from 'react-native';
import { appColors } from '../../../style/appColors';
import CustomErrorText from '../../../components/custom/custom.error.text.component';
import OnboardingHeadline from '../../../components/onboarding/onboarding.headline.component';
import InfoText from '../../../components/custom/styleguide-components/info.text.component';
import { Separator } from '../../../components/custom/styleguide-components/Separator';
import { useDisableBackButton } from '../../../navigation/back-button/useDisableBackButton';
import { useAxios } from '../../../util/useAxios';
import { TrackingContext } from '../../../analytics/tracking.context';
import {
  AppsFlyerEvents,
  extractUserProfileEventValues,
} from '../../../analytics/appsflyer.analytics';
import { IUserProfile } from '@match-app/shared';
import logEvent from '../../../analytics/analytics';
import { OnboardingEvent } from '../../../analytics/analytics.event';
import OnboardingFinishButton from './onboarding.finish.button.component';
import { ProfileContext } from '../../../states/profile.state';

export interface OnboardingFinishScreenProps {
  navigation: {
    restart: () => void;
  };
}

export const OnboardingFinishScreen = (props: OnboardingFinishScreenProps) => {
  const { l10n } = useContext(LocalizationContext);

  const { logAppsFlyerEvent } = useContext(TrackingContext);
  const { state, dispatch } = useContext(ProfileContext);
  const [isLoading, setIsLoading] = useState(false);

  const [{ data: profileData, error, loading: axiosLoading }, completeProfile] =
    useAxios<IUserProfile>({
      method: 'POST',
      url: 'profile/complete',
      initial: true,
      onSuccess: async ({ data }) => {
        logEvent(OnboardingEvent.completed);
        if (data) {
          try {
            setIsLoading(true);
            logAppsFlyerEvent(AppsFlyerEvents.CompleteRegistrationTotal);
            if (data.gender) {
              logAppsFlyerEvent(
                AppsFlyerEvents.CompleteRegistration[data.gender],
                extractUserProfileEventValues(data),
              );
              dispatch({
                type: 'setProfile',
                profile: { ...state.profile, ...data },
              });
            }
          } catch (e) {
            console.error(e);
          } finally {
            setIsLoading(false);
          }
        }
      },
    });

  useDisableBackButton();

  return (
    <View useSafeArea={true} style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.content}>
          <OnboardingHeader />
          <Separator />
          <OnboardingHeadline
            sectionTitle={
              axiosLoading || isLoading || error
                ? l10n.onboarding.generalHeader
                : l10n.onboarding.finishHeader
            }
          />
          <LogoIcon
            width={styles.logo.width}
            height={styles.logo.height}
            style={styles.logo}
          />
          {error ? (
            <View style={styles.errorContainer}>
              <CustomErrorText
                description={error.response?.data.message}
                style={styles.errorFinish}
              />
            </View>
          ) : (
            <InfoText style={styles.continueHintText}>
              {axiosLoading || isLoading
                ? l10n.onboarding.finish.loadingTitle
                : l10n.onboarding.finish.title}
            </InfoText>
          )}
          <View style={styles.continueContainer}>
            {axiosLoading || isLoading ? (
              <ActivityIndicator color={appColors.primary} size={'small'} />
            ) : (
              <OnboardingFinishButton
                error={error}
                navigation={props.navigation}
                profileData={profileData}
                completeProfile={completeProfile}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
