import { useContext, useState } from 'react';
import { SignUpPhoneContext } from './signup.phone.state';
import { isPhoneNumberValid } from '../../services/validation';
import { PickerItemValue } from 'react-native-ui-lib/typings/components/Picker';
import { CountryCallingCode } from '../../util/phone.authentication.supported.countries';
import {
  parseFirebaseSignUpError,
  signInWithPhoneNumber,
} from '../../services/authentication';
import { LocalizationContext } from '../../services/LocalizationContext';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

export interface useSignUpPhoneEnterNumberSelectorProps {
  onSendSuccess: () => void;
  isLogin?: boolean;
}

const useSignUpPhoneEnterNumberSelector = (
  props: useSignUpPhoneEnterNumberSelectorProps,
) => {
  const { dispatch, state } = useContext(SignUpPhoneContext);
  const { onSendSuccess, isLogin } = props;

  const { l10n } = useContext(LocalizationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onNumberChange = (number: string) => {
    dispatch({ type: 'setNumber', number: number });
  };

  const onCallingCodeChange = (item: PickerItemValue) => {
    dispatch({
      type: 'setCountryCallingCode',
      countryCallingCode: (item as { label: string; value: CountryCallingCode })
        ?.value,
    });
  };

  const onSendPress = async () => {
    setError(undefined);
    setIsLoading(true);
    try {
      const result = await signInWithPhoneNumber(
        state.countryCallingCode.callingCode + state.number,
      );
      dispatch({
        type: 'setConfirm',
        confirm: result,
      });
      onSendSuccess();
      if (!isLogin) {
        logEvent(FunnelEvents.enterPhoneNumberSuccessful);
      }
    } catch (e) {
      console.error(e);
      if (typeof e === 'string') {
        setError(parseFirebaseSignUpError(e, l10n));
      } else {
        setError(e);
      }
    } finally {
      setIsLoading(false);
      if (!isLogin) {
        logEvent(FunnelEvents.enterPhoneNumberUnsuccessful);
      }
    }
  };

  return {
    number: state.number,
    countryCallingCode: state.countryCallingCode,
    isSendEnabled: isPhoneNumberValid(
      state.countryCallingCode.callingCode + state.number,
    ),
    isLoading,
    error,
    onNumberChange,
    onCallingCodeChange,
    onSendPress,
  };
};

export default useSignUpPhoneEnterNumberSelector;
