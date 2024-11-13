import appsFlyer from 'react-native-appsflyer';
import { APPS_FLYER_DEV_KEY, IOS_APP_ID } from '../constants';
import { Gender, IUserProfile } from '@match-app/shared';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';

export const initAppsFlyer = async (): Promise<void> => {
  await appsFlyer.initSdk({
    devKey: APPS_FLYER_DEV_KEY,
    isDebug: __DEV__,
    timeToWaitForATTUserAuthorization: 240,
    appId: IOS_APP_ID,
    onInstallConversionDataListener: true, //Optional
    onDeepLinkListener: true, //Optional
  });
  console.log('Initialized AppsFlyer.');

  appsFlyer.setOneLinkCustomDomains(
    ['click.onedollarxclub.com'],
    () => {
      console.log('setOneLinkCustomDomains - success');
    },
    (e) => {
      console.error(e);
    },
  );

  messaging()
    .getToken()
    .then(async (token) => {
      // will fail if sdk not initialized
      appsFlyer.updateServerUninstallToken(token);
    });
  appsFlyer.onInstallConversionData(console.log);
};

export const extractUserProfileEventValues = (userProfile: IUserProfile) => {
  const userParameters: Record<string, unknown> = {
    AFEventParamRegMethod: userProfile.email ? 'email' : 'mobile',
    AFEventParamAge: assignAgeGroup(
      userProfile.birthday
        ? moment().diff(moment(userProfile.birthday), 'years')
        : undefined,
    ),
    AFEventParamPreferenceAgeMin: assignAgeGroup(userProfile.preferredAgeMin),
    AFEventParamPreferenceAgeMax: assignAgeGroup(userProfile.preferredAgeMax),
  };
  userProfile.preferredGender.forEach((gender) => {
    switch (gender) {
      case Gender.MALE:
        userParameters.AFEventParamPreferenceGender1 = 'Men';
        break;
      case Gender.FEMALE:
        userParameters.AFEventParamPreferenceGender2 = 'Women';
        break;
      case Gender.NON_BINARY:
        userParameters.AFEventParamPreferenceGender3 = 'Not-binary';
        break;
    }
  });
  return userParameters;
};

export const AppsFlyerEvents = {
  RegistrationInitiated: 'af_registration_initiated',
  CompleteRegistrationTotal: 'af_complete_registration_total',
  CompleteRegistration: {
    [Gender.FEMALE]: 'af_complete_registration_female',
    [Gender.NON_BINARY]: 'af_complete_registration_nb',
    [Gender.MALE]: 'af_complete_registration_male',
  },
  CompletePaymentTotal: 'af_start_trial_total',
  CompletePayment: {
    [Gender.FEMALE]: 'af_start_trial_female',
    [Gender.NON_BINARY]: 'af_start_trial_nb',
    [Gender.MALE]: 'af_start_trial_male',
  },
};

export function assignAgeGroup(age?: number): string {
  if (!age) {
    return '18_24';
  }
  if (age >= 65) {
    return '65_asc';
  }
  if (age >= 51) {
    return '51_65';
  }
  if (age >= 41) {
    return '41_50';
  }
  if (age >= 31) {
    return '31_40';
  }
  if (age >= 25) {
    return '25_30';
  }
  return '18_24';
}
