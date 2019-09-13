import './YTWLink.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface LinkProps {
  className?: string;
  href: string;
  nav?: boolean;
  children?: ReactNode;
}

function YTWLink({ className, href, nav, children, ...props }: LinkProps) {
  const router = useRouter();
  const isActive = router.route === href;

  return (
    <Link href={href}>
      <a
        {...props}
        className={classNames(
          'ytw-link',
          { 'ytw-link--active': isActive, 'ytw-link--nav': nav },
          className
        )}
      >
        {children}
      </a>
    </Link>
  );
}

YTWLink.displayName = 'YTWLink';
YTWLink.propTypes = {
  href: PropTypes.string.isRequired,
  nav: PropTypes.bool
};

interface NewTabLinkProps {
  className?: string;
  href: string;
  children?: ReactNode;
}

function NewTabLink({ className, children, ...props }: NewTabLinkProps) {
  return (
    <a
      {...props}
      className={classNames('ytw-link', className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

NewTabLink.displayName = 'NewTabLink';

export { YTWLink, NewTabLink };
