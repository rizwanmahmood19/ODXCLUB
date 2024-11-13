import React, { createContext, Dispatch, useReducer } from 'react';

const imageCheckReducer = (
  state: ImageCheckStateType,
  action: ImageCheckAction,
) => {
  switch (action.type) {
    case 'addImage':
      return { ...state, images: [...state.images, action.imageId] };
    case 'removeImage':
      return {
        ...state,
        images: [...state.images].filter((img) => img !== action.imageId),
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
};

export type ImageCheckAction =
  | { type: 'addImage'; imageId: string }
  | { type: 'removeImage'; imageId: string }
  | { type: 'reset' };

type ImageCheckStateType = {
  images: string[];
};

const initialState: ImageCheckStateType = {
  images: [],
};

const ImageCheckContext = createContext<{
  state: ImageCheckStateType;
  dispatch: Dispatch<ImageCheckAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const ImageCheckProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(imageCheckReducer, initialState);
  return (
    <ImageCheckContext.Provider value={{ state, dispatch }}>
      {children}
    </ImageCheckContext.Provider>
  );
};

export { ImageCheckContext, ImageCheckProvider };
