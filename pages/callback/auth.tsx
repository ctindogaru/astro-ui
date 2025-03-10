import { ACCOUNT_COOKIE } from 'constants/cookies';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

import { SputnikNearService } from 'services/sputnik';

const Callback: NextPage = () => {
  useEffect(() => {
    if (window.opener?.sputnikRequestSignInCompleted) {
      const { searchParams } = new URL(window.location.toString());
      const accountId = searchParams.get('account_id') || undefined;
      const errorCode = (searchParams.get('errorCode') ||
        undefined) as SputnikWalletErrorCodes;

      SputnikNearService.init();

      window.opener.sputnikRequestSignInCompleted({ accountId, errorCode });

      setTimeout(() => {
        window.close();
      }, 1500);
    } else {
      console.error('Unable to find login callback function');
      window.close();
    }
  }, []);

  return null;
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  const accountId = query.account_id;

  res.setHeader(
    'set-cookie',
    `${ACCOUNT_COOKIE}=${accountId}; path=/; Max-Age=${Number.MAX_SAFE_INTEGER}`
  );

  return { props: {} };
};

export default Callback;
