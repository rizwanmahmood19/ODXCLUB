import React, { createContext, Dispatch, useReducer } from 'react';

const tokenReducer = (state: TokenStateType, action: TokenAction) => {
  switch (action.type) {
    case 'setToken':
      return { ...state, token: action.token };
    default:
      return state;
  }
};

export type TokenAction = {
  type: 'setToken';
  token: string;
};

type TokenStateType = {
  token: string;
};

const initialState: TokenStateType = {
  token: '',
};

const TokenContext = createContext<{
  state: TokenStateType;
  dispatch: Dispatch<TokenAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const TokenProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(tokenReducer, initialState);
  return (
    <TokenContext.Provider value={{ state, dispatch }}>
      {children}
    </TokenContext.Provider>
  );
};

export { TokenProvider, TokenContext };
