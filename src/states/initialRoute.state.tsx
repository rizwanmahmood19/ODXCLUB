import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { AppRoute } from '../navigation/app.routes';
import { HomeTapTabsNavigatorParams } from '../navigation/home.navigator';

type InitialRouteState = {
  appReadyRoute: { name: AppRoute; params?: Record<string, unknown> };
  setAppReadyRoute: Dispatch<
    SetStateAction<InitialRouteState['appReadyRoute']>
  >;
  homeInitialRoute: keyof HomeTapTabsNavigatorParams;
  setHomeInitialRoute: Dispatch<
    SetStateAction<InitialRouteState['homeInitialRoute']>
  >;
};

const InitialRouteContext = createContext<InitialRouteState>({
  appReadyRoute: { name: AppRoute.HOME },
  setAppReadyRoute: () => null,
  homeInitialRoute: AppRoute.DISCOVER,
  setHomeInitialRoute: () => null,
});

const InitialRouteProvider: React.FC = ({ children }) => {
  const [appReadyRoute, setAppReadyRoute] = useState({
    name: AppRoute.HOME,
  });
  const [homeInitialRoute, setHomeInitialRoute] = useState<
    keyof HomeTapTabsNavigatorParams
  >(AppRoute.DISCOVER);

  return (
    <InitialRouteContext.Provider
      value={{
        appReadyRoute,
        setAppReadyRoute,
        homeInitialRoute,
        setHomeInitialRoute,
      }}>
      {children}
    </InitialRouteContext.Provider>
  );
};

export { InitialRouteProvider, InitialRouteContext };
