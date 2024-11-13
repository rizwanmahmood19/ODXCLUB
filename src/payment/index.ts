import { PaymentContextProd, PaymentProviderProd } from './PaymentContextProd';
import { PaymentContextDev, PaymentProviderDev } from './PaymentContextDevMock';

// to test real payment switch these statements:
export const PaymentProvider = __DEV__
  ? PaymentProviderDev
  : PaymentProviderProd;
export const PaymentContext = __DEV__ ? PaymentContextDev : PaymentContextProd;
