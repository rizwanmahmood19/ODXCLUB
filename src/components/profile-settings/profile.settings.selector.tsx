import { useContext, useEffect, useState } from 'react';

import { useSignOut } from '../../scenes/auth/useSignOut';
import { openLink, openMail } from '../../services/linking';
import useProfileChangeSelector from '../../scenes/profile/profile.change.selector';
import links from '../../services/links';
import { AuthContext } from '../../states/auth.state';
import messaging from '@react-native-firebase/messaging';
import { useAppState } from '../../services/app.state';

export enum SettingsLinkAction {
  Support,
  FAQ,
  Privacy,
  Conditions,
  DeleteAccount,
  Logout,
}

const useProfileSettingsSelector = () => {
  const { signOut, isSigningOut } = useSignOut();
  const {
    initialValues,
    handleAgeChange,
    handleAgeChangeEnd,
    handleAllowsPushNotificationsChange,
    handleAllowsPassionAlertsChange,
    handleSearchRadiusChange,
    handleSearchRadiusChangeEnd,
    handlePickerChange,
  } = useProfileChangeSelector();
  const [deleteAccountMenuPresented, setDeleteAccountMenuPresented] =
    useState(false);
  const [signOutMenuPresented, setSignOutMenuPresented] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const { state } = useContext(AuthContext);

  const [
    hasPermissionForPushNotifications,
    setHasPermissionForPushNotifications,
  ] = useState<boolean | undefined>();

  const checkPushNotifications = async () => {
    const result = await messaging().hasPermission();

    switch (result) {
      case messaging.AuthorizationStatus.DENIED:
        setHasPermissionForPushNotifications(false);
        break;
      case messaging.AuthorizationStatus.AUTHORIZED:
      case messaging.AuthorizationStatus.PROVISIONAL:
        setHasPermissionForPushNotifications(true);
        break;
      default:
        break;
    }
  };

  useAppState({ onForeground: () => checkPushNotifications() });

  useEffect(() => {
    checkPushNotifications();
  }, []);

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    await signOut(true);
    setIsDeletingAccount(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };
  const dismissSignOutMenu = () => {
    setSignOutMenuPresented(false);
  };

  const dismissDeleteAccountMenu = () => {
    setDeleteAccountMenuPresented(false);
  };

  const handleLinkAction = async (action: SettingsLinkAction) => {
    switch (action) {
      case SettingsLinkAction.Conditions:
        await openLink(links.termsURL);
        break;
      case SettingsLinkAction.FAQ:
        await openLink(links.faqURL);
        break;
      case SettingsLinkAction.Privacy:
        await openLink(links.privacyURL);
        break;
      case SettingsLinkAction.Support:
        openMail(links.supportMail);
        break;
      case SettingsLinkAction.Logout:
        setSignOutMenuPresented(true);
        break;
      case SettingsLinkAction.DeleteAccount:
        setDeleteAccountMenuPresented(true);
        break;
      default:
        break;
    }
  };

  return {
    initialValues: {
      ...initialValues,
      allowsPushNotifications:
        initialValues.allowsPushNotifications &&
        hasPermissionForPushNotifications,
    },
    handleLinkAction,
    handleDeleteAccount,
    handleSignOut,
    handleAllowsPushNotificationsChange,
    handleAllowsPassionAlertsChange,
    signOut,
    isSigningOut,
    deleteAccountMenuPresented,
    dismissDeleteAccountMenu,
    signOutMenuPresented,
    dismissSignOutMenu,
    isDeletingAccount,
    handleAgeChange,
    handleAgeChangeEnd,
    handleSearchRadiusChange,
    handleSearchRadiusChangeEnd,
    handlePickerChange,
    user: state.user,
    hasPermissionForPushNotifications,
  };
};

export default useProfileSettingsSelector;
