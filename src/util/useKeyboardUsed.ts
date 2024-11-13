import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { noop } from './noop';
import { is_iOS } from './osCheck';

export const useKeyboardUsed = () => {
  const [keyboardUsed, setKeyboardUsed] = useState(false);

  useEffect(() => {
    const showKeyboardEvent = is_iOS ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideKeyboardEvent = 'keyboardDidHide';

    Keyboard.addListener(showKeyboardEvent, () => setKeyboardUsed(true));
    Keyboard.addListener(hideKeyboardEvent, () => setKeyboardUsed(false));

    return () => {
      Keyboard.removeListener(showKeyboardEvent, noop);
      Keyboard.removeListener(hideKeyboardEvent, noop);
    };
  }, []);

  return { keyboardUsed };
};
