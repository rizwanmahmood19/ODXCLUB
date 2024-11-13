import { BackHandler } from 'react-native';
import { is_iOS } from '../../util/osCheck';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export function useDisableBackButton() {
  const handleHardwareBackPress = (): boolean => {
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      if (is_iOS) {
        return;
      }

      BackHandler.addEventListener(
        'hardwareBackPress',
        handleHardwareBackPress,
      );

      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleHardwareBackPress,
        );
      };
    }, []),
  );
}
