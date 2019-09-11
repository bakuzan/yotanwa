import './YTWLink.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

function YTWLink({ className, href, children, nav, ...props }) {
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

function NewTabLink({ children, ...props }) {
  return (
    <YTWLink {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </YTWLink>
  );
}

NewTabLink.displayName = 'NewTabLink';

export { YTWLink, NewTabLink };
