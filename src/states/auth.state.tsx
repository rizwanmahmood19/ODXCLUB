import React, { createContext, Dispatch, useReducer } from 'react';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { currentUser } from '../services/authentication';

export enum ForcedSignOutReason {
  emailNotVerified,
  newMail,
  addMail,
}

const authReducer = (state: AuthStateType, action: AuthAction) => {
  switch (action.type) {
    case 'setUser':
      return { ...state, user: action.user };
    case 'setForcedSignOutReason':
      return { ...state, forcedSignOutReason: action.forcedSignOutReason };
    default:
      return state;
  }
};

export type AuthAction =
  | { type: 'setUser'; user: FirebaseAuthTypes.User | null }
  | {
      type: 'setForcedSignOutReason';
      forcedSignOutReason?: ForcedSignOutReason;
    };

export type AuthStateType = {
  user: FirebaseAuthTypes.User | null;
  forcedSignOutReason?: ForcedSignOutReason;
};

const initialState: AuthStateType = {
  user: currentUser(),
};

const AuthContext = createContext<{
  state: AuthStateType;
  dispatch: Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
