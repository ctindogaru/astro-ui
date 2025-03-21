import React from 'react';

import { Meta, Story } from '@storybook/react';
import { DaoDetails, DaoDetailsProps } from 'astro_2.0/components/DaoDetails';

export default {
  title: 'astro_2.0/DaoDetails/DaoDetails',
  component: DaoDetails,
  decorators: [
    story => (
      <div
        style={{
          padding: '1rem 1rem 1rem 10rem',
          background: '#e5e5e5',
          maxWidth: 1280,
        }}
      >
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<DaoDetailsProps> = (args): JSX.Element => (
  <DaoDetails {...args} />
);

Template.storyName = 'DaoDetails';

Template.args = {
  onCreateProposalClick: () => {
    // eslint-disable-next-line no-console
    console.log('create proposal');
  },
  accountId: 'anima.testnet',
  activeProposals: 8,
  totalProposals: 23,
  dao: {
    id: 'saturn.sputnikv2.testnet',
    txHash: '4px581fv2HJ5LuWBUs72qouAJnZ5ka4bEA2ZLmixgjHD',
    name: 'saturn',
    description:
      'We’re a community grant for artists who want to build projects on our platform. Join our Discord channel to stay up to date with latest info!',
    members: 3,
    activeProposalsCount: 11,
    totalProposalsCount: 15,
    lastProposalId: 12,
    proposals: 13,
    totalProposals: 15,
    logo:
      'https://image.freepik.com/free-photo/blue-liquid-marble-background-abstract-flowing-texture-experimental-art_53876-104502.jpg',
    funds: '17043.60259',
    createdAt: '2021-10-22T12:46:32.885Z',
    groups: [
      {
        members: ['anima.testnet'],
        name: 'Council',
        permissions: [
          '*:Finalize',
          '*:AddProposal',
          '*:VoteApprove',
          '*:VoteReject',
          '*:VoteRemove',
        ],
        votePolicy: {},
        slug: 'Council',
      },
      {
        members: ['animatronic.testnet'],
        name: 'Mages',
        permissions: [
          '*:Finalize',
          '*:AddProposal',
          '*:VoteApprove',
          '*:VoteReject',
          '*:VoteRemove',
        ],
        votePolicy: {},
        slug: 'Mages',
      },
    ],
    policy: {
      createdAt: '2021-10-22T12:46:32.885Z',
      daoId: 'saturn.sputnikv2.testnet',
      proposalBond: '100000000000000000000000',
      bountyBond: '100000000000000000000000',
      proposalPeriod: '604800000000000',
      bountyForgivenessPeriod: '604800000000000',
      defaultVotePolicy: {
        weightKind: 'RoleWeight',
        quorum: '0',
        kind: 'Ratio',
        weight: '',
        ratio: [3, 10],
      },
      roles: [
        {
          createdAt: '2021-10-22T12:46:32.885Z',
          id: 'saturn.sputnikv2.testnet-all',
          name: 'all',
          kind: 'Everyone',
          balance: null,
          accountIds: null,
          permissions: ['*:AddProposal'],
          votePolicy: {},
        },
        {
          createdAt: '2021-10-22T12:46:32.885Z',
          id: 'saturn.sputnikv2.testnet-Council',
          name: 'Council',
          kind: 'Group',
          balance: null,
          accountIds: ['anima.testnet', 'animatronic.testnet'],
          permissions: [
            '*:Finalize',
            '*:AddProposal',
            '*:VoteApprove',
            '*:VoteReject',
            '*:VoteRemove',
          ],
          votePolicy: {},
        },
      ],
    },
    links: ['example.com'],
    displayName: 'Saturn',
  },
};
