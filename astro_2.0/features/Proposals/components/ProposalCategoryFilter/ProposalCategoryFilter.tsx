import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { ProposalCategories } from 'types/proposal';

import styles from './ProposalCategoryFilter.module.scss';

const FEED_CATEGORIES = [
  { value: ProposalCategories.Governance, label: 'Governance' },
  { value: ProposalCategories.Financial, label: 'Financial' },
  { value: ProposalCategories.Bounties, label: 'Bounties' },
  { value: ProposalCategories.Members, label: 'Members' },
  { value: ProposalCategories.Polls, label: 'Polls' },
];

interface ProposalCategoryFilterProps {
  title?: string;
  disabled?: boolean;
  queryName: string;
  query: Record<string, string | string[]>;
  className?: string;
  titleClassName?: string;
  list?: { value: string; label: string }[];
}

export const ProposalCategoryFilter = ({
  query,
  queryName,
  disabled,
  className,
  titleClassName,
  title,
  list,
}: ProposalCategoryFilterProps): JSX.Element => {
  const { [queryName]: value, ...otherQuery } = query;

  return (
    <div className={classNames(styles.categoriesListRoot, className)}>
      {title && (
        <p className={classNames(styles.categoriesListTitle, titleClassName)}>
          {title}
        </p>
      )}

      <ul
        className={classNames(styles.categoriesList, {
          [styles.categoriesListActive1]:
            list?.[0] && value === list?.[0]?.value,
          [styles.categoriesListActive2]:
            list?.[1] && value === list?.[1]?.value,
          [styles.categoriesListActive3]:
            list?.[2] && value === list?.[2]?.value,
          [styles.categoriesListActive4]:
            list?.[3] && value === list?.[3]?.value,
          [styles.categoriesListActive5]:
            list?.[4] && value === list?.[4]?.value,
        })}
      >
        <li className={styles.categoriesListItemWrapper}>
          <Link href={{ query: otherQuery }} replace shallow scroll={false}>
            <a
              className={classNames(styles.categoriesListItem, {
                [styles.categoriesListItemSelected]: !value,
                '.disabled': disabled,
              })}
              tabIndex={disabled ? -1 : 0}
            >
              All
            </a>
          </Link>
        </li>

        {list?.map(item => {
          const href = {
            query: {
              ...query,
              [queryName]: item.value,
            },
          };

          if (query[queryName] === item.value) {
            delete (href.query as Partial<typeof href.query>).category;
          }

          return (
            <li key={item.value} className={styles.categoriesListItemWrapper}>
              <Link href={href} replace shallow scroll={false}>
                <a
                  className={classNames(styles.categoriesListItem, {
                    [styles.categoriesListItemSelected]:
                      query[queryName] === item.value,
                    '.disabled': disabled,
                  })}
                  tabIndex={disabled ? -1 : 0}
                >
                  {item.label}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ProposalCategoryFilter.defaultProps = {
  disabled: undefined,
  className: undefined,
  title: undefined,
  list: FEED_CATEGORIES,
};
