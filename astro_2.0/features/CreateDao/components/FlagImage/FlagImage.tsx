import React, { FC } from 'react';

import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';
import { DaoImageType } from 'astro_2.0/features/CreateDao/components/types';

import styles from './FlagImage.module.scss';

export interface FlagImageProps {
  title: string;
  description: string;
  requirements: string;
  fieldName: DaoImageType;
}

export const FlagImage: FC<FlagImageProps> = props => {
  const { title, description, requirements, fieldName } = props;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className={styles.content}>
        <ImageUpload fieldName={fieldName} />
        <div>{requirements}</div>
      </div>
    </div>
  );
};
