import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './navigation/app.navigator';
import { AppRoute } from './navigation/app.routes';
import { navigationRef } from './services/navigate';
import { PORTRAIT, OrientationLocker } from 'react-native-orientation-locker';
import auth from '@react-native-firebase/auth';

import { AppProvider } from './app.provider.component';
import { is_iOS } from './util/osCheck';
import GlobalNotifications from './components/notifications/global.notifications';
import { OverlayProvider, Streami18n } from 'stream-chat-react-native';
import { theme } from './components/chat/chat.style';
import enTranslation from '../../shared/src/localization/streami18n/en.json';
import deTranslation from '../../shared/src/localization/streami18n/de.json';

const streami18n = new Streami18n();
streami18n.registerTranslation('en', enTranslation);
streami18n.registerTranslation('de', deTranslation);

const App = () => {
  // Set Firebase language to app language
  auth().setLanguageCode(null);

  return (
    <AppProvider>
      <OrientationLocker orientation={PORTRAIT} />
      <StatusBar barStyle={is_iOS ? 'dark-content' : 'light-content'} />
      <GlobalNotifications />
      <NavigationContainer ref={navigationRef}>
        <OverlayProvider i18nInstance={streami18n} value={{ style: theme }}>
          <AppNavigator initialRouteName={AppRoute.LOADING} />
        </OverlayProvider>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
