import { renderHook } from '@testing-library/react-hooks';
import useSignUpPhoneEnterNumberSelector from '../../../src/scenes/auth/signup.phone.enter.number.selector';

describe('useSignUpPhoneEnterNumberSelector test', () => {
  const props = { onSendSuccess: jest.fn() };

  it('Ensures DE is the default countryCallingCode', () => {
    const { result } = renderHook(() =>
      useSignUpPhoneEnterNumberSelector(props),
    );

    expect(result.current.countryCallingCode.country).toBe('DE');
  });
});
