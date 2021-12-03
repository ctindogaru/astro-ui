import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  NotificationCard,
  NotificationCardProps,
} from 'astro_2.0/components/NotificationCard';
import { NotificationStatus, NotificationType } from 'types/notification';

export default {
  title: 'astro_2.0/NotificationCard',
  component: NotificationCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#e5e5e5', maxWidth: 885 }}>
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<NotificationCardProps> = (args): JSX.Element => (
  <NotificationCard {...args} />
);

Template.storyName = 'NotificationCard';

Template.args = {
  isNew: true,
  isRead: false,
  isMuted: false,
  isMuteAvailable: true,
  isMarkReadAvailable: true,
  isDeleteAvailable: true,
  toggleMuteHandler: () => {
    // eslint-disable-next-line no-console
    console.log('Mute/unmute notification');
  },
  markReadHandler: () => {
    // eslint-disable-next-line no-console
    console.log('Mark notification read');
  },
  deleteHandler: () => {
    // eslint-disable-next-line no-console
    console.log('Delete notification');
  },
  content: {
    id: '',
    type: NotificationType.DaoConfig,
    status: NotificationStatus.Success,
    text: 'Your New DAO Ref.Finance has been successfully created.',
    time: '9:07 am',
    flagCover:
      'https://image.freepik.com/free-photo/blue-liquid-marble-background-abstract-flowing-texture-experimental-art_53876-104502.jpg',
    logo: '',
  },
};
