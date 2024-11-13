import { AxiosError } from 'axios';
import { useContext } from 'react';
import { BlockedUserContext } from '../states/blocked.user.state';

export const useBlockedUserHandler = () => {
  const { dispatch } = useContext(BlockedUserContext);

  const checkAndSetBlockedUser = (
    error: AxiosError,
    shouldSetToFalse?: boolean,
  ) => {
    if (
      error &&
      error.response?.data.statusCode === 403 &&
      error.response?.data.message.toLowerCase().indexOf('blocked') !== -1
    ) {
      dispatch({ type: 'setBlockedUser', isUserBlocked: true });
    } else {
      if (shouldSetToFalse) {
        dispatch({ type: 'setBlockedUser', isUserBlocked: false });
      }
    }
  };

  return { checkAndSetBlockedUser };
};
