import React, { createContext, Dispatch, useReducer } from 'react';
import { IProfilePicture, IUserProfile } from '@match-app/shared';
import { noop } from '../util/noop';

const profileReducer = (state: ProfileStateType, action: ProfileAction) => {
  switch (action.type) {
    case 'setProfile':
      return { ...state, profile: action.profile };
    case 'setIsSaving':
      return { ...state, isSaving: action.isSaving };
    case 'setIsValid':
      return { ...state, isValid: action.isValid };
    default:
      return state;
  }
};

export type ProfileAction =
  | { type: 'setProfile'; profile: IUserProfile | null }
  | { type: 'setIsSaving'; isSaving: boolean }
  | { type: 'setIsValid'; isValid: boolean };

type ProfileStateType = {
  profile: IUserProfile | null;
  isSaving: boolean;
  isValid: boolean;
};

const initialState: ProfileStateType = {
  profile: null,
  isSaving: false,
  isValid: true,
};

const ProfileContext = createContext<{
  state: ProfileStateType;
  profile?: IUserProfile;
  dispatch: Dispatch<ProfileAction>;
  setCanUndo: (flag: boolean) => void;
  addPicture: (picture: IProfilePicture) => void;
}>({
  state: initialState,
  dispatch: noop,
  setCanUndo: noop,
  addPicture: noop,
});

const ProfileProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const setCanUndo = (flag: boolean) => {
    if (!state.profile) {
      return;
    }
    dispatch({
      type: 'setProfile',
      profile: { ...state.profile, canUndoLastSwipeDecision: flag },
    });
  };
  const addPicture = (picture: IProfilePicture) => {
    if (!state.profile) {
      return;
    }
    const pictures: IProfilePicture[] = [...state.profile.pictures];
    pictures.splice(picture.index, 0, picture);
    dispatch({
      type: 'setProfile',
      profile: {
        ...state.profile,
        pictures,
      },
    });
  };
  return (
    <ProfileContext.Provider
      value={{
        state,
        dispatch,
        profile: state.profile || undefined,
        addPicture,
        setCanUndo,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileProvider, ProfileContext };
