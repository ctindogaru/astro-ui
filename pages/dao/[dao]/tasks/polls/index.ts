import Polls, { PollsPageProps } from 'pages/dao/[dao]/tasks/polls/PollsPage';
import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ProposalCategories, ProposalStatuses } from 'types/proposal';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

export default Polls;

export const getServerSideProps: GetServerSideProps<PollsPageProps> = async ({
  query,
  req,
}) => {
  const daoId = query.dao as string;
  const status = query.status as ProposalStatuses;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, initialPollsData] = await Promise.all([
    SputnikHttpService.getDaoContext(account, daoId),
    SputnikHttpService.getProposalsList({
      category: ProposalCategories.Polls,
      daoId,
      status,
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
      daoFilter: 'All DAOs',
    }),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      daoContext,
      initialPollsData,
    },
  };
};
