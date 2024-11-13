import React, { createContext, Dispatch, useReducer } from 'react';

const signUpMailReducer = (
  state: SignUpMailStateType,
  action: SignUpMailAction,
) => {
  switch (action.type) {
    case 'setEmail':
      return { ...state, email: action.email };
    case 'setPassword':
      return { ...state, password: action.password };
    case 'setVerificationId':
      return { ...state, verificationId: action.verificationId };
    default:
      return state;
  }
};

export type SignUpMailAction =
  | { type: 'setEmail'; email: string }
  | { type: 'setPassword'; password: string }
  | { type: 'setVerificationId'; verificationId: string | undefined };

type SignUpMailStateType = {
  email: string;
  password: string;
  verificationId: string | undefined;
};

const initialState = {
  email: '',
  password: '',
  verificationId: undefined,
};

const SignUpMailContext = createContext<{
  state: SignUpMailStateType;
  dispatch: Dispatch<SignUpMailAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const SignUpMailProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(signUpMailReducer, initialState);
  return (
    <SignUpMailContext.Provider value={{ state, dispatch }}>
      {children}
    </SignUpMailContext.Provider>
  );
};

export { SignUpMailProvider, SignUpMailContext };
