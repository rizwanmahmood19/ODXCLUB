import React from 'react';
import axios from 'axios';

import { LocalizationProvider } from './services/LocalizationContext';
import { AuthProvider } from './states/auth.state';
import { ProfileProvider } from './states/profile.state';
import { TokenProvider } from './states/token.state';
import { ChatProvider } from './states/chat.state';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { appendToBaseUrl } from './util/appendToBaseUrl';
import { handleAppCenterInit } from './services/appCenter';
import { BlockedUserProvider } from './states/blocked.user.state';
import { AudioControlProvider } from './components/chat/audio-messages/audio.control.context';
import { PaymentProvider } from './payment';
import { PortalProvider } from './util/PortalContext';
import { TrackingProvider } from './analytics/tracking.context';
import { SetupProvider } from './states/SetupContext';
import { MaybeListProvider } from './states/maybeList.state';
import { noop } from './util/noop';
import { CatchModalProvider } from './components/deck/catch-modal/catch.modal.context';
import { MatchListProvider } from './states/matchList.state';
import { InitialRouteProvider } from './states/initialRoute.state';
import { ImageCheckProvider } from './states/imageCheck.state';

axios.defaults.baseURL = appendToBaseUrl('api');

export const AppProvider: React.FC = ({ children }) => {
  handleAppCenterInit().then(noop);

  return (
    <SafeAreaProvider>
      <SetupProvider>
        <TrackingProvider>
          <LocalizationProvider>
            <ProfileProvider>
              <ImageCheckProvider>
                <PaymentProvider>
                  <AuthProvider>
                    <TokenProvider>
                      <CatchModalProvider>
                        <MaybeListProvider>
                          <MatchListProvider>
                            <ChatProvider>
                              <AudioControlProvider>
                                <BlockedUserProvider>
                                  <PortalProvider>
                                    <InitialRouteProvider>
                                      {children}
                                    </InitialRouteProvider>
                                  </PortalProvider>
                                </BlockedUserProvider>
                              </AudioControlProvider>
                            </ChatProvider>
                          </MatchListProvider>
                        </MaybeListProvider>
                      </CatchModalProvider>
                    </TokenProvider>
                  </AuthProvider>
                </PaymentProvider>
              </ImageCheckProvider>
            </ProfileProvider>
          </LocalizationProvider>
        </TrackingProvider>
      </SetupProvider>
    </SafeAreaProvider>
  );
};
