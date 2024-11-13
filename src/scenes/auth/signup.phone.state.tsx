import React, { createContext, Dispatch, useReducer } from 'react';
import {
  CountryCallingCode,
  countriesOnTop,
} from '../../util/phone.authentication.supported.countries';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const signUpPhoneReducer = (
  state: SignUpPhoneStateType,
  action: SignUpPhoneAction,
) => {
  switch (action.type) {
    case 'setCountryCallingCode':
      return { ...state, countryCallingCode: action.countryCallingCode };
    case 'setNumber':
      return { ...state, number: action.number };
    case 'setConfirm':
      return { ...state, confirm: action.confirm };
    case 'setVerificationId':
      return { ...state, verificationId: action.verificationId };
    default:
      return state;
  }
};

export type SignUpPhoneAction =
  | { type: 'setCountryCallingCode'; countryCallingCode: CountryCallingCode }
  | { type: 'setNumber'; number: string }
  | {
      type: 'setConfirm';
      confirm: FirebaseAuthTypes.ConfirmationResult | null;
    }
  | { type: 'setVerificationId'; verificationId: string | undefined };

type SignUpPhoneStateType = {
  countryCallingCode: CountryCallingCode;
  number: string;
  confirm: FirebaseAuthTypes.ConfirmationResult | null;
  verificationId?: string;
};

const initialState: SignUpPhoneStateType = {
  countryCallingCode: countriesOnTop.find(
    (country) => country.country === 'DE',
  )!,
  number: '',
  confirm: null,
  verificationId: undefined,
};

const SignUpPhoneContext = createContext<{
  state: SignUpPhoneStateType;
  dispatch: Dispatch<SignUpPhoneAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const SignUpPhoneProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(signUpPhoneReducer, initialState);
  return (
    <SignUpPhoneContext.Provider value={{ state, dispatch }}>
      {children}
    </SignUpPhoneContext.Provider>
  );
};

export { SignUpPhoneProvider, SignUpPhoneContext };
