import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { appColors } from '../style/appColors';

export const openMail = (url: string) => {
  Linking.openURL(`mailto:${url}`);
};

export const openLink = async (url: string) => {
  if (url.length === 0) {
    console.error("Can't handle url: " + url);
    return;
  }

  if (await InAppBrowser.isAvailable()) {
    await _openLinkInAppBrowser(url);
  } else {
    _openLinkExternal(url);
  }
};

const _openLinkExternal = (url: string) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        console.error("Can't handle url: " + url);
        return;
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('An error occurred', err));
};

const _openLinkInAppBrowser = async (url: string) => {
  // workaround for Issue https://github.com/proyecto26/react-native-inappbrowser/issues/131
  try {
    InAppBrowser.close();
    await InAppBrowser.open(url, {
      // iOS Properties
      dismissButtonStyle: 'cancel',
      preferredBarTintColor: appColors.primary,
      preferredControlTintColor: 'white',
      readerMode: false,
      animated: true,
      modalPresentationStyle: 'fullScreen',
      modalEnabled: true,
      enableBarCollapsing: false,
      // Android Properties
      showTitle: true,
      toolbarColor: appColors.primary,
      secondaryToolbarColor: appColors.secondary,
      enableUrlBarHiding: true,
      enableDefaultShare: true,
      forceCloseOnRedirection: false,
    });
  } catch (e) {
    console.error(e);
  }
};
