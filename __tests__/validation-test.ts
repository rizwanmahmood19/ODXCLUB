import { isEmailValid, isPasswordValid } from '../src/services/validation';

describe('Email Validation', () => {
  it('checks invalid email scheme', () => {
    const invalidEmail = 'test@mail';
    expect(isEmailValid(invalidEmail)).toBeFalsy();
  });

  it('checks valid email scheme', () => {
    const validEmail = 'test@mail.de';
    expect(isEmailValid(validEmail)).toBeTruthy();
  });
});

describe('Password Validation', () => {
  it('checks too short password length', () => {
    const tooShortPassword = '+++++7';
    expect(isPasswordValid(tooShortPassword)).toBeFalsy();
  });

  it('checks password with min length, one character and one number', () => {
    const minPasswordLength = '++++++a8';
    expect(isPasswordValid(minPasswordLength)).toBeTruthy();
  });
});
