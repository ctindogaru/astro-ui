import { format, formatDistance, isAfter } from 'date-fns';

import {
  BountyCardContent,
  CardType,
} from 'astro_2.0/components/BountyCard/types';
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { DAO } from 'types/dao';
import { Bounty, BountyStatus, ClaimedBy } from 'types/bounties';

export const toMillis = (timePeriod: string): number =>
  Math.round(Number(timePeriod) / 1000000);

const calculateBountyStatus = (claim: ClaimedBy): BountyStatus => {
  return isAfter(Date.now(), toMillis(claim.endTime))
    ? BountyStatus.Expired
    : BountyStatus.InProgress;
};

export const getDistanceFromNow = (timePeriod: string): string => {
  return formatDistance(new Date(toMillis(timePeriod)), 0, {
    addSuffix: true,
  });
};

export const formatDate = (date: string): string => {
  return format(toMillis(date), 'd LLLL yyyy');
};

export const mapBountyToCardContent = (
  dao: DAO,
  bounty: Bounty,
  tokens: Tokens,
  currentUser: string,
  bountyStatus: BountyStatus
): BountyCardContent[] => {
  const tokenData =
    bounty.tokenId === '' ? tokens.NEAR : tokens[bounty.tokenId];

  const commonProps = {
    id: bounty.id,
    daoId: dao.id,
    amount: bounty.amount,
    description: bounty.description,
    externalUrl: bounty.externalUrl,
    forgivenessPeriod: bounty.forgivenessPeriod,
    token: tokenData,
    bountyBond: dao.policy.bountyBond,
  };

  const result: BountyCardContent[] = [];

  const includeBountyStatuses = [BountyStatus.Available];
  const includeClaimsStatuses = [BountyStatus.InProgress, BountyStatus.Expired];

  if (!bountyStatus || includeBountyStatuses.includes(bountyStatus)) {
    result.push({
      ...commonProps,
      status: BountyStatus.Available,
      type: CardType.Bounty,
      timeToComplete: getDistanceFromNow(bounty.deadlineThreshold),
      slots: bounty.slots,
      claimedByCurrentUser: false,
    });
  }

  if (!bountyStatus || includeClaimsStatuses.includes(bountyStatus)) {
    result.push(
      ...bounty.claimedBy.map(claim => {
        return {
          ...commonProps,
          type: CardType.Claim,
          status: calculateBountyStatus(claim),
          accountId: claim.accountId,
          claimedByCurrentUser: claim.accountId === currentUser,
          timeToComplete: formatDate(claim.endTime),
        };
      })
    );
  }

  return result;
};

export const showActionBar = (
  bountyCardContent: BountyCardContent,
  account: string | undefined
): boolean => {
  if (!account) {
    return false;
  }

  if (bountyCardContent.status === BountyStatus.Available) {
    return true;
  }

  return (
    (bountyCardContent.status === BountyStatus.InProgress ||
      bountyCardContent.status === BountyStatus.Expired) &&
    bountyCardContent.accountId === account
  );
};
