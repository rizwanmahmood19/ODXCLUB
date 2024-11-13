import React, { useContext } from 'react';
import { LocalizationContext } from '../../../services/LocalizationContext';
import CustomButton from '../../../components/custom/styleguide-components/custom.button.component';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosResult } from '../../../util/useAxios';
import { IUserProfile } from '@match-app/shared';
import styles from '../style';
import { OnboardingFinishScreenProps } from './onboarding.finish.component';

export interface OnboardingFinishButtonProps {
  navigation: OnboardingFinishScreenProps['navigation'];
  error: AxiosError<any> | undefined;
  profileData: IUserProfile | undefined;
  completeProfile: (
    configOverride?: Partial<AxiosRequestConfig> | undefined,
  ) => Promise<AxiosResult>;
}

const OnboardingFinishButton = (props: OnboardingFinishButtonProps) => {
  const { navigation, error, completeProfile } = props;
  const { l10n } = useContext(LocalizationContext);

  const handleSubmitPress = async () => {
    if (error) {
      if (error?.response?.status === 400) {
        navigation.restart();
      } else {
        await completeProfile();
      }
    }
  };

  return (
    <CustomButton style={styles.continueButton} onPress={handleSubmitPress}>
      {error
        ? error?.response?.status === 400
          ? l10n.onboarding.finish.buttonRestartTitle
          : l10n.onboarding.finish.buttonRetryTitle
        : l10n.onboarding.finish.buttonRecommendationTitle}
    </CustomButton>
  );
};

export default OnboardingFinishButton;
