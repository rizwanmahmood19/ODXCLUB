import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface AppStateHookSettings {
  onChange?: (status: AppStateStatus) => void;
  onForeground?: () => void;
  onBackground?: () => void;
}

export const useAppState = (settings?: AppStateHookSettings) => {
  const { onChange, onForeground, onBackground } = settings || {};
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      if (
        nextAppState === 'active' &&
        appState !== 'active' &&
        onForeground &&
        typeof onForeground === 'function'
      ) {
        onForeground();
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/) &&
        onBackground &&
        typeof onBackground === 'function'
      ) {
        onBackground();
      }
      setAppState(nextAppState);
      if (onChange && typeof onChange === 'function') {
        onChange(nextAppState);
      }
    }
    AppState.addEventListener('change', handleAppStateChange);

    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, [onChange, onForeground, onBackground, appState]);

  return { appState };
};
