import React, { createContext, Dispatch, useReducer } from 'react';

const blockedUserReducer = (
  state: BlockedUserStateType,
  action: BlockedUserAction,
) => {
  switch (action.type) {
    case 'setBlockedUser':
      return { ...state, isUserBlocked: action.isUserBlocked };
    default:
      return state;
  }
};

export type BlockedUserAction = {
  type: 'setBlockedUser';
  isUserBlocked: boolean;
};

type BlockedUserStateType = {
  isUserBlocked: boolean;
};

const initialState: BlockedUserStateType = {
  isUserBlocked: false,
};

const BlockedUserContext = createContext<{
  state: BlockedUserStateType;
  dispatch: Dispatch<BlockedUserAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const BlockedUserProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(blockedUserReducer, initialState);
  return (
    <BlockedUserContext.Provider value={{ state, dispatch }}>
      {children}
    </BlockedUserContext.Provider>
  );
};

export { BlockedUserProvider, BlockedUserContext };
