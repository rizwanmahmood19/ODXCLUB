import { useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { AuthContext } from '../states/auth.state';

export function useSignInProvider() {
  const [signInProvider, setSignInProvider] = useState<string | null>();
  const {
    state: { user },
  } = useContext(AuthContext);
  const forceSignInProviderCheck = async () => {
    if (user) {
      const tokenResult = await user.getIdTokenResult(true);
      if (tokenResult) {
        const payload = jwt_decode<{
          firebase: { sign_in_provider: string | null };
        }>(tokenResult.token);
        setSignInProvider(payload?.firebase?.sign_in_provider);
      }
    } else {
      setSignInProvider(null);
    }
  };

  // update online status when app comes to foreground
  useEffect(() => {
    forceSignInProviderCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return signInProvider;
}
