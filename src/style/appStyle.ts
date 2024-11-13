import { Assets, Colors } from 'react-native-ui-lib';
import { appColors } from './appColors';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { appFont } from './appFont';
import { is_iOS } from '../util/osCheck';

Assets.loadAssetsGroup('icons', {
  blurredEye: require('./../../assets/icons/blurred-eye.png'),
  passwordVisibility: require('./../../assets/icons/matchapp_ic_visibility.png'),
  passwordInVisibility: require('./../../assets/icons/matchapp_ic_invisibility.png'),
  smartphone: require('./../../assets/icons/matchapp_ic_smartphone.png'),
  mail: require('./../../assets/icons/matchapp_ic_mail.png'),
  yeahStamp: require('./../../assets/icons/matchapp_yeah_stamp.png'),
  nopeStamp: require('./../../assets/icons/matchapp_nope_stamp.png'),
  maybeStamp: require('./../../assets/icons/matchapp_maybe_stamp.png'),
});

Assets.loadAssetsGroup('images', {
  defaultProfile: require('./../../assets/images/defaultProfile.png'),
  extendedLogo: require('./../../assets/images/extendedLogo.png'),
  allowGPSBackground: require('./../../assets/images/allowGPSBackground.png'),
  allowNotificationsBackground: require('./../../assets/images/allowNotificationsBackground.png'),
  allowTrackingBackground: require('./../../assets/images/allowTrackingBackground.png'),
  welcomeBackground: require('./../../assets/images/welcomeBackground.png'),
  deckGradient: require('./../../assets/images/deckGradient.png'),
  smGradient: require('./../../assets/images/smGradient.png'),
  subscriptionBackground0: require('./../../assets/images/Sub_BG01.png'),
  subscriptionBackground1: require('./../../assets/images/Sub_BG02.png'),
  subscriptionBackground2: require('./../../assets/images/Sub_BG03.png'),
  subscriptionBackground3: require('./../../assets/images/Sub_BG04.png'),
  subscriptionBackground4: require('./../../assets/images/Sub_BG05.png'),
  tutorialBg1: require('./../../assets/images/tutorial/Tutorial_BG01.png'),
  tutorialBg2: require('./../../assets/images/tutorial/Tutorial_BG02.png'),
  tutorialBg3: require('./../../assets/images/tutorial/Tutorial_BG03.png'),
  tutorialBg4: require('./../../assets/images/tutorial/Tutorial_BG04.png'),
  tutorialBg5: require('./../../assets/images/tutorial/Tutorial_BG05.png'),
  tutorialBg6: require('./../../assets/images/tutorial/Tutorial_BG06.png'),
});

// FIXME: is there a better way to override the done button color in date time picker component?
Colors.loadColors({
  blue30: appColors.primary,
});

export const appStyles = {
  borderRadius: 14,
  bottomMargin: Math.max(
    is_iOS ? StaticSafeAreaInsets.safeAreaInsetsBottom : 24,
    24,
  ),
  topMargin: Math.max(is_iOS ? StaticSafeAreaInsets.safeAreaInsetsTop : 24, 24),
};

// We need to use the medium appFont for all text inputs, other font weights are displayed incorrectly in Android.
// If we need to use a bolder font, we need to set a FontWeight property
export const textInputStyles = {
  fontFamily: appFont.medium,
  fontSize: 14,
};
