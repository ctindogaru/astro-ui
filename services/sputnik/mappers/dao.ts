import get from 'lodash/get';

import { DAO, DaoVotePolicy } from 'types/dao';
import { DaoRole } from 'types/role';
import { formatYoktoValue } from 'helpers/format';
import Decimal from 'decimal.js';
import { CreateDaoParams } from 'services/sputnik/types';
import { YOKTO_NEAR } from 'services/sputnik/constants';
import { getAwsImageUrl } from './utils/getAwsImageUrl';

export type DaoPolicy = {
  createdAt: string;
  daoId: string;
  proposalBond: string;
  bountyBond: string;
  proposalPeriod: string;
  bountyForgivenessPeriod: string;
  defaultVotePolicy: DaoVotePolicy;
  roles: DaoRole[];
};

type DaoConfig = {
  name: string;
  purpose: string;
  metadata: string;
};

export interface GetDAOsResponse {
  data: DaoDTO[];
  total: number;
}

export type DaoDTO = {
  createdAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: string;
  updateTimestamp: string;
  id: string;
  config: DaoConfig;
  amount: string;
  totalSupply: string;
  lastBountyId: number;
  lastProposalId: number;
  numberOfProposals: number;
  stakingContract: string;
  numberOfAssociates: number;
  council: string[];
  councilSeats: number;
  link: unknown | null;
  description: string | null;
  status: 'Success';
  policy: DaoPolicy;
  activeProposalCount: number;
  totalProposalCount: number;
};

export type DaoMetadata = {
  links: string[];
  flagCover?: string;
  flagLogo?: string;
  flag?: string;
  displayName: string;
};

export const fromMetadataToBase64 = (metadata: DaoMetadata): string => {
  return Buffer.from(JSON.stringify(metadata)).toString('base64');
};

export const fromBase64ToMetadata = (metaAsBase64: string): DaoMetadata => {
  return JSON.parse(Buffer.from(metaAsBase64, 'base64').toString('ascii'));
};

export const mapDaoDTOtoDao = (daoDTO: DaoDTO): DAO => {
  const roles = get(daoDTO, 'policy.roles', []);
  const numberOfProposals = get(daoDTO, 'totalProposalCount', 0);

  // Transform amount
  const funds = formatYoktoValue(daoDTO.amount);

  // Get DAO groups
  const daoGroups = roles
    .filter((item: DaoRole) => item.kind === 'Group')
    .map((item: DaoRole) => {
      return {
        members: item.accountIds,
        name: item.name,
        permissions: item.permissions,
        votePolicy: item.votePolicy,
        slug: item.name,
      };
    });

  const config = get(daoDTO, 'config');

  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  const numberOfMembers = daoGroups
    .map(({ members }: { members: string[] }) => members)
    .flat()
    .reduce((acc: string[], member: string) => {
      if (!acc.includes(member)) {
        acc.push(member);
      }

      return acc;
    }, []).length;

  return {
    id: daoDTO.id,
    txHash: daoDTO.transactionHash,
    name: config?.name ?? '',
    description: config?.purpose ?? '',
    members: numberOfMembers,
    proposals: numberOfProposals,
    activeProposalsCount: daoDTO.activeProposalCount ?? 0,
    totalProposalsCount: daoDTO.totalProposalCount ?? 0,
    totalProposals: numberOfProposals,
    logo: meta?.flag
      ? getAwsImageUrl(meta.flag)
      : getAwsImageUrl('default.png'),
    flagCover: getAwsImageUrl(meta?.flagCover),
    flagLogo: getAwsImageUrl(meta?.flagLogo),
    funds,
    createdAt: daoDTO.createdAt,
    groups: daoGroups,
    policy: daoDTO.policy,
    links: meta && meta.links ? meta.links : [],
    displayName: meta?.displayName || '',
    lastProposalId: daoDTO.lastProposalId,
  };
};

export const mapDaoDTOListToDaoList = (daoList: DaoDTO[]): DAO[] => {
  return daoList.map(daoItem => {
    return mapDaoDTOtoDao(daoItem);
  });
};

export const mapCreateDaoParamsToContractArgs = (
  params: CreateDaoParams
): string => {
  const argsList = {
    purpose: params.purpose,
    bond: new Decimal(params.bond).mul(YOKTO_NEAR).toFixed(),
    vote_period: new Decimal(params.votePeriod).mul('3.6e12').toFixed(),
    grace_period: new Decimal(params.gracePeriod).mul('3.6e12').toFixed(),
    policy: {
      roles: params.policy.roles,
      default_vote_policy: params.policy.defaultVotePolicy,
      proposal_bond: new Decimal(params.policy.proposalBond)
        .mul(YOKTO_NEAR)
        .toFixed(),
      proposal_period: new Decimal(params.policy.proposalPeriod)
        .mul('3.6e12')
        .toFixed(),
      bounty_bond: new Decimal(params.policy.bountyBond)
        .mul(YOKTO_NEAR)
        .toFixed(),
      bounty_forgiveness_period: new Decimal(
        params.policy.bountyForgivenessPeriod
      )
        .mul('3.6e12')
        .toFixed(),
    },
    config: {
      name: params.name,
      purpose: params.purpose,
      metadata: fromMetadataToBase64({
        links: params.links,
        flagCover: params.flagCover,
        flagLogo: params.flagLogo,
        displayName: params.displayName,
      }),
    },
  };

  return Buffer.from(JSON.stringify(argsList)).toString('base64');
};
