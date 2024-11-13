import { BackHandler } from 'react-native';
import { is_iOS } from '../../util/osCheck';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export function useBackButton(callback: () => boolean) {
  useFocusEffect(
    useCallback(() => {
      if (is_iOS) {
        return;
      }
      BackHandler.addEventListener('hardwareBackPress', callback);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', callback);
      };
    }, [callback]),
  );
}
