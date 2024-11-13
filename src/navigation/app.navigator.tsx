import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { AuthNavigator } from './auth.navigator';
import { ProfileSettingsNavigator } from './profile.settings.navigator';
import { LoadingScreen } from '../scenes/loading';
import { useAppStart } from '../services/app.start';
import UserMailNotVerified from '../scenes/auth/user.mail.not.verified.component';
import { ChangeCredentialNavigator } from './change-credential/change.credential.navigator';
import { BlockedUserScreen } from '../scenes/blocked-user';
import { AppBlockerNavigator } from './app.blocker.navigator';
import useNotifications from '../util/useNotifcations';
import { TrackingDecisionScreen } from '../scenes/tracking/tracking-decision.screen';
import { InitialTOSScreen } from '../scenes/initial-tos/initial-tos.screen';
import { AllowGPSScreen } from '../scenes/allow-gps/allow.gps.component';
import { AllowPushNotificationsScreen } from '../scenes/allow-push-notifications/allow.push.notifications.component';
import { AppReadyNavigator } from './app.ready.navigator';
import { useSignInProvider } from './useSignInProvider';
import { OnboardingNavigator } from './onboarding/onboarding.navigator';
import { PhotoEditNavigator } from './photo.edit.navigator';
import TutorialScreen from '../scenes/tutorial/tutorial.screen';
import { PhotoUpdateScreen } from '../scenes/profile';

type StackNavigatorProps = React.ComponentProps<typeof Stack.Navigator>;

export type AppNavigatorParams = {
  [AppRoute.LOADING]: undefined;
  [AppRoute.AUTH]: undefined;
  [AppRoute.ALLOW_GPS]: undefined;
  [AppRoute.ALLOW_PUSH_NOTIFICATIONS]: undefined;
  [AppRoute.HOME]: undefined;
  [AppRoute.INITIAL_TOS]: undefined;
  [AppRoute.SECRET_MESSAGE]: undefined;
  [AppRoute.TRACKING_DECISION]: undefined;
  [AppRoute.APP_BLOCKER]: undefined;
  [AppRoute.BLOCKED_USER]: undefined;
  [AppRoute.ONBOARDING]: undefined;
  [AppRoute.TUTORIAL]: undefined;
  [AppRoute.MAIL_NOT_VERIFIED]: undefined; // modal
  [AppRoute.PROFILE_EDIT]: { params: { showPreview: boolean } }; // modal
  [AppRoute.PROFILE_SETTINGS]: undefined; // modal
  [AppRoute.PROFILE_EDIT_PHOTOS]: undefined; // modal
  [AppRoute.PHOTO_EDIT]: undefined; // modal
  [AppRoute.PHOTO_UPDATE]: undefined; // modal
  [AppRoute.CHAT]: undefined; // modal
  [AppRoute.PASSION_ALERT]: undefined; // modal
  [AppRoute.CHANGE_CREDENTIAL]: {
    screen:
      | AppRoute.CHANGE_CREDENTIAL_PHONE_NUMBER
      | AppRoute.CHANGE_CREDENTIAL_MAIL;
    params: { addBehaviour: boolean };
  }; // modal
  [AppRoute.CHANGE_CREDENTIAL_MAIL_SUCCESS]: {
    params: { addBehaviour: boolean };
  };
};

const Stack = createStackNavigator<AppNavigatorParams>();

export const AppNavigator = (
  props: Partial<StackNavigatorProps>,
): React.ReactElement => {
  const {
    isLoading,
    state,
    profile,
    isUserBlocked,
    initialTosAgree,
    hasDealtWithGPS,
    hasDealtWithPN,
    trackingStatus,
    paymentProblem,
  } = useAppStart();

  const signInProvider = useSignInProvider();
  useNotifications();

  // app is not ready
  if (isLoading) {
    return (
      <Stack.Navigator {...props} headerMode="none">
        <Stack.Screen
          name={AppRoute.LOADING}
          component={LoadingScreen}
          options={{}}
        />
      </Stack.Navigator>
    );
  }

  if (!initialTosAgree) {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name={AppRoute.INITIAL_TOS}
          component={InitialTOSScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  // Tracking screen only appears for iOS >= 14
  // iOS < 14 and android have trackingStatus as 'unavailable'
  if (trackingStatus === 'not-determined') {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name={AppRoute.TRACKING_DECISION}
          component={TrackingDecisionScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  if (isUserBlocked) {
    return (
      <Stack.Navigator {...props} headerMode="none">
        <Stack.Screen
          name={AppRoute.BLOCKED_USER}
          component={BlockedUserScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  // no auth user
  if (!state.user) {
    return (
      <Stack.Navigator {...props} headerMode="none">
        <Stack.Screen
          name={AppRoute.AUTH}
          component={AuthNavigator}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  // wait for find out the current sign in provider
  if (!signInProvider) {
    return (
      <Stack.Navigator {...props} headerMode="none">
        <Stack.Screen
          name={AppRoute.LOADING}
          component={LoadingScreen}
          options={{}}
        />
      </Stack.Navigator>
    );
  }

  // handles auth users with not verified email (excepts auth users which are registered via phone)
  if (
    signInProvider === 'password' &&
    state.user.email &&
    !state.user.emailVerified
  ) {
    return (
      <Stack.Navigator {...props} headerMode="none" mode="modal">
        <Stack.Screen
          name={AppRoute.MAIL_NOT_VERIFIED}
          component={UserMailNotVerified}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  if (
    paymentProblem ||
    profile?.tosAccepted === false ||
    profile?.tosAccepted === null
  ) {
    return (
      <Stack.Navigator {...props} headerMode="none" mode="modal">
        <Stack.Screen
          name={AppRoute.APP_BLOCKER}
          component={AppBlockerNavigator}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen
          name={AppRoute.PROFILE_SETTINGS}
          component={ProfileSettingsNavigator}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen
          name={AppRoute.CHANGE_CREDENTIAL}
          component={ChangeCredentialNavigator}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  if (profile && !profile.isComplete) {
    return (
      <Stack.Navigator {...props} headerMode="none">
        <Stack.Screen
          name={AppRoute.ONBOARDING}
          component={OnboardingNavigator}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen
          name={AppRoute.PHOTO_EDIT}
          component={PhotoEditNavigator}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen
          name={AppRoute.PHOTO_UPDATE}
          component={PhotoUpdateScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  if (profile?.isComplete && !hasDealtWithGPS) {
    return (
      <Stack.Navigator {...props} headerMode="none">
        <Stack.Screen
          name={AppRoute.ALLOW_GPS}
          component={AllowGPSScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  if (profile?.isComplete && !hasDealtWithPN) {
    return (
      <Stack.Navigator {...props} headerMode="none">
        <Stack.Screen
          name={AppRoute.ALLOW_PUSH_NOTIFICATIONS}
          component={AllowPushNotificationsScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  if (profile && !profile.hasCompletedTutorial) {
    return (
      <Stack.Navigator {...props} headerMode="none">
        <Stack.Screen
          name={AppRoute.TUTORIAL}
          component={TutorialScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  // app is ready to use
  return <AppReadyNavigator profile={profile} />;
};
