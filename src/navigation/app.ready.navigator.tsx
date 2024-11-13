import React, { useContext } from 'react';
import { AppRoute } from './app.routes';
import { HomeNavigator } from './home.navigator';
import { ProfileEditNavigator } from './profile.edit.navigator';
import { ProfileEditPhotosNavigator } from './profile.edit.photos.navigator';
import { ProfileSettingsNavigator } from './profile.settings.navigator';
import { PhotoEditNavigator } from './photo.edit.navigator';
import { ChatNavigator } from './chat.navigator';
import { PassionAlertNavigator } from './passion.alert.navigator';
import { ChangeCredentialNavigator } from './change-credential/change.credential.navigator';
import SecretMessageScreen from '../scenes/secret-message/secret.message.screen';
import { createStackNavigator } from '@react-navigation/stack';
import { PhotoUpdateScreen } from '../scenes/profile';
import { InitialRouteContext } from '../states/initialRoute.state';

const Stack = createStackNavigator();

export const AppReadyNavigator: React.FC<Record<string, any>> = (props) => {
  const { appReadyRoute } = useContext(InitialRouteContext);
  const getInitialParams = (route: AppRoute) =>
    appReadyRoute.name === route ? appReadyRoute.params : undefined;

  return (
    <Stack.Navigator
      {...props}
      initialRouteName={appReadyRoute.name}
      headerMode="none">
      <Stack.Screen
        name={AppRoute.HOME}
        component={HomeNavigator}
        initialParams={getInitialParams(AppRoute.HOME)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={AppRoute.SECRET_MESSAGE}
        component={SecretMessageScreen}
        initialParams={getInitialParams(AppRoute.SECRET_MESSAGE)}
      />
      <Stack.Screen
        name={AppRoute.PROFILE_EDIT}
        component={ProfileEditNavigator}
        initialParams={getInitialParams(AppRoute.PROFILE_EDIT)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={AppRoute.PROFILE_EDIT_PHOTOS}
        component={ProfileEditPhotosNavigator}
        initialParams={getInitialParams(AppRoute.PROFILE_EDIT_PHOTOS)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={AppRoute.PROFILE_SETTINGS}
        component={ProfileSettingsNavigator}
        initialParams={getInitialParams(AppRoute.PROFILE_SETTINGS)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={AppRoute.PHOTO_EDIT}
        component={PhotoEditNavigator}
        initialParams={getInitialParams(AppRoute.PHOTO_EDIT)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={AppRoute.PHOTO_UPDATE}
        component={PhotoUpdateScreen}
        initialParams={getInitialParams(AppRoute.PHOTO_UPDATE)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={AppRoute.CHAT}
        component={ChatNavigator}
        initialParams={getInitialParams(AppRoute.CHAT)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={AppRoute.PASSION_ALERT}
        component={PassionAlertNavigator}
        initialParams={getInitialParams(AppRoute.PASSION_ALERT)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={AppRoute.CHANGE_CREDENTIAL}
        component={ChangeCredentialNavigator}
        initialParams={getInitialParams(AppRoute.CHANGE_CREDENTIAL)}
        options={{ animationEnabled: false }}
      />
    </Stack.Navigator>
  );
};
