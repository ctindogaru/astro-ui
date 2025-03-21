import React, {
  FC,
  useState,
  ReactNode,
  useCallback,
  HTMLAttributes,
} from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';

import { Badge } from 'components/badge/Badge';
import { Icon, IconName } from 'components/Icon';
import { DotsLoader } from 'astro_2.0/components/DotsLoader';

import { useIsHrefActive } from 'hooks/useIsHrefActive';
import { useOnRouterChange } from 'hooks/useOnRouterChange';

import styles from './NavItem.module.scss';

interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  label: string | ReactNode;
  href?: string;
  urlParams?: string | null | ParsedUrlQueryInput | undefined;
  icon: IconName;
  count?: number;
  active?: boolean;
  className?: string;
  topDelimiter?: boolean;
  bottomDelimiter?: boolean;
  subHrefs?: string[];
  onClick?: () => void;
}

export const NavItem: FC<NavItemProps> = ({
  label,
  icon,
  href,
  urlParams,
  count,
  active,
  className,
  topDelimiter,
  bottomDelimiter,
  subHrefs = [],
  onClick,
  children,
}) => {
  const isActive = useIsHrefActive(href, subHrefs);
  const [showLoader, setShowLoader] = useState(false);

  const onRouteChange = useCallback(() => {
    setShowLoader(false);
  }, []);

  useOnRouterChange(onRouteChange);

  function handleOnClick() {
    setShowLoader(true);
    onClick?.();
  }

  function renderIcon() {
    return showLoader ? (
      <DotsLoader dotClassName={styles.loaderDot} />
    ) : (
      <Icon height={24} name={icon} className={styles.icon} />
    );
  }

  function renderContent() {
    const rootClassName = cn(styles.nav, className, {
      [styles.active]: active || isActive,
      [styles.topDelimiter]: topDelimiter,
      [styles.bottomDelimiter]: bottomDelimiter,
      [styles.nonClickable]: !href && !onClick,
    });

    const props = {
      onClick: handleOnClick,
      onKeyPress: handleOnClick,
      className: rootClassName,
    };

    const content = (
      <>
        {renderIcon()}
        <span className={styles.label}> {label} </span>
        {Number.isFinite(count) && (
          <Badge className={styles.badge} variant="primary" size="small">
            {count && count > 99 ? '99+' : count}
          </Badge>
        )}
      </>
    );

    if (href) {
      return (
        <Link href={{ pathname: href, query: urlParams }} passHref>
          <a href="*" {...props}>
            {content}
          </a>
        </Link>
      );
    }

    return <div {...props}>{content}</div>;
  }

  function renderChildren() {
    if (isActive) {
      return children;
    }

    return null;
  }

  return (
    <>
      {renderContent()}
      {renderChildren()}
    </>
  );
};

NavItem.defaultProps = {
  href: '',
  count: undefined,
  active: false,
  className: '',
  topDelimiter: false,
  bottomDelimiter: false,
  onClick: undefined,
} as Partial<NavItemProps>;
