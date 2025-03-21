import { nanoid } from 'nanoid';

import { DAO, Member } from 'types/dao';
import { Proposal } from 'types/proposal';
import { SearchResultsData } from 'types/search';

import { DaoDTO, mapDaoDTOListToDaoList } from './dao';
import { mapProposalDTOListToProposalList, ProposalDTO } from './proposal';

type MemberDTO = {
  id: string;
  name: string;
  groups: string[];
  tokens: {
    type: string;
    value: number;
    percent: number;
  };
  votes: number;
};

export interface SearchResultsDTO {
  daos: DaoDTO[];
  proposals: ProposalDTO[];
  members: MemberDTO[];
}

export interface SearchResponse {
  daos: {
    data: DaoDTO[];
  };
  proposals: {
    data: ProposalDTO[];
  };
}

export const extractMembersFromDaosList = (
  daos: DAO[],
  proposals: Proposal[],
  query: string
): Member[] => {
  const members = {} as Record<string, Member>;

  const votesPerProposer = proposals.reduce((acc, currentProposal) => {
    const vote = currentProposal.votes[currentProposal.proposer];

    if (vote) {
      if (acc[currentProposal.proposer]) {
        acc[currentProposal.proposer] += 1;
      } else {
        acc[currentProposal.proposer] = 1;
      }
    }

    return acc;
  }, {} as Record<string, number>);

  daos.forEach(dao => {
    dao.groups.forEach(grp => {
      const users = grp.members;

      users.forEach(user => {
        if (!members[user]) {
          members[user] = {
            id: nanoid(),
            name: user,
            groups: [grp.name],
            tokens: {
              type: 'NEAR',
              value: 18,
              percent: 14,
            },
            votes: votesPerProposer[user],
          };
        } else {
          members[user] = {
            ...members[user],
            groups: [...members[user].groups, grp.name],
          };
        }
      });
    });
  });

  return Object.values(members)
    .map(item => {
      return {
        ...item,
        groups: Array.from(new Set(item.groups)),
      };
    })
    .filter(item => {
      return item.name && item.name.includes(query);
    });
};

export const extractMembersFromDao = (
  dao: DAO,
  proposals: Proposal[]
): Member[] => {
  const votesPerProposer = proposals.reduce((acc, currentProposal) => {
    const vote = currentProposal.votes[currentProposal.proposer];

    if (vote) {
      if (acc[currentProposal.proposer]) {
        acc[currentProposal.proposer] += 1;
      } else {
        acc[currentProposal.proposer] = 1;
      }
    }

    return acc;
  }, {} as Record<string, number>);

  const members = {} as Record<string, Member>;

  dao.groups.forEach(grp => {
    const users = grp.members;

    users.forEach(user => {
      if (!members[user]) {
        members[user] = {
          id: nanoid(),
          name: user,
          groups: [grp.name],
          // TODO - tokens are now hidden in UI
          tokens: {
            type: 'NEAR',
            value: 18,
            percent: 14,
          },
          votes: votesPerProposer[user] ?? null,
        };
      } else {
        members[user] = {
          ...members[user],
          groups: [...members[user].groups, grp.name],
        };
      }
    });
  });

  return Object.values(members).map(item => {
    return {
      ...item,
      groups: Array.from(new Set(item.groups)),
    };
  });
};

export const mapSearchResultsDTOToDataObject = (
  query: string,
  data: SearchResultsDTO
): SearchResultsData | null => {
  if (query === '') {
    return null;
  }

  const daos = mapDaoDTOListToDaoList(data.daos ?? []);
  const proposals = mapProposalDTOListToProposalList(data.proposals ?? []);
  const members = extractMembersFromDaosList(daos, proposals, query);

  return {
    query,
    daos,
    proposals,
    members,
  };
};
