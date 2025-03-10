import { useRouter } from 'next/router';
import { createContext, FC, useContext, useState } from 'react';

import { ALL_FEED_URL } from 'constants/routing';
import { ACCOUNT_COOKIE, DAO_COOKIE } from 'constants/cookies';

import { SputnikWalletError } from 'errors/SputnikWalletError';
import { SputnikNearService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

interface AuthContextInterface {
  accountId: string;
  login: () => void;
  logout: () => void;
}

/* eslint-disable @typescript-eslint/no-empty-function */
const AuthContext = createContext<AuthContextInterface>({
  accountId: '',
  login: () => {},
  logout: () => {},
});
/* eslint-enable @typescript-eslint/no-empty-function */

export const AuthWrapper: FC = ({ children }) => {
  const router = useRouter();
  const [accountId, setAccountId] = useState(SputnikNearService.getAccountId());

  async function login() {
    try {
      await SputnikNearService.login();

      const id = SputnikNearService.getAccountId();

      if (id) {
        setAccountId(id);
      }
    } catch (err) {
      console.warn(err);

      if (err instanceof SputnikWalletError) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          description: err.message,
          lifetime: 20000,
        });
      }
    }
  }

  async function logout() {
    await SputnikNearService.logout();

    setAccountId('');
    CookieService.remove(ACCOUNT_COOKIE);
    CookieService.remove(DAO_COOKIE);

    router.push(ALL_FEED_URL);
  }

  const data = {
    accountId,
    login,
    logout,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextInterface {
  return useContext(AuthContext);
}
