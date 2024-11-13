import { useContext, useEffect } from 'react';
import { TokenContext } from '../states/token.state';
import { userToken } from './authentication';
import auth from '@react-native-firebase/auth';

export const useTokenChange = () => {
  const { dispatch } = useContext(TokenContext);

  const handleNewToken = async () => {
    const newToken = await userToken(false);
    dispatch({ type: 'setToken', token: newToken ? newToken : '' });
  };

  useEffect(() => {
    const unsubscribe = auth().onIdTokenChanged((user) => {
      if (user) {
        handleNewToken();
      } else {
        dispatch({ type: 'setToken', token: '' });
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
