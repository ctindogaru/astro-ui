import React from 'react';
// import cn from 'classnames';
import { NotificationCardContent } from 'astro_2.0/components/NotificationCard/types';
// import { NotificationStatus, NotificationType } from 'types/notification';
import styles from './NotificationCard.module.scss';

export interface NotificationCardProps {
  content: NotificationCardContent;
  isNew: boolean;
  isRead: boolean;
  isMuted: boolean;
  isMuteAvailable: boolean;
  isMarkReadAvailable: boolean;
  isDeleteAvailable: boolean;
  markReadHandler: () => void;
  toggleMuteHandler: () => void;
  deleteHandler: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  content,
  isNew,
  isRead,
  isMuted,
  isMuteAvailable,
  isMarkReadAvailable,
  isDeleteAvailable,
  markReadHandler,
  toggleMuteHandler,
  deleteHandler,
}) => {
  const { type, status, text, time, flagCover, logo } = content;

  return (
    <div className={styles.root}>
      <p>{type}</p>
      <p>{status}</p>
      <p>{text}</p>
      <p>{time}</p>
      <p>{flagCover}</p>
      <p>{logo}</p>
      {isMarkReadAvailable && !isRead && (
        <button type="button" onClick={markReadHandler}>
          Mark read
        </button>
      )}
      {isMuteAvailable && !isMuted && (
        <button type="button" onClick={toggleMuteHandler}>
          Mute
        </button>
      )}
      {isDeleteAvailable && isNew && (
        <button type="button" onClick={deleteHandler}>
          Delete
        </button>
      )}
    </div>
  );
};
