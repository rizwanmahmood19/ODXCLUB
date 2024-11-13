import validator from 'validator';
import moment from 'moment';

const RegExpValidator = (regexp: RegExp, value: string): boolean => {
  return regexp.test(value);
};

export const isEmailValid = (value: string): boolean => {
  return validator.isEmail(value);
};

export const PATTERN_PASSWORD = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

export const isPasswordValid = (value: string): boolean => {
  // TODO: define password rules
  return RegExpValidator(PATTERN_PASSWORD, value);
};

export const isGreaterEqualAge18 = (date: Date): boolean => {
  return moment().diff(moment(date), 'years') >= 18;
};

// https://phoneregex.com
export const PATTERN_PHONE_NUMBER =
  /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

export const isPhoneNumberValid = (value: string): boolean => {
  return RegExpValidator(PATTERN_PHONE_NUMBER, value);
};
