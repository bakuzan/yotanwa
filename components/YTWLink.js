import './YTWLink.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import Link from 'next/link';

function YTWLink({ className, href, children, ...props }) {
  return (
    <Link href={href}>
      <a {...props} className={classNames('ytw-link', className)}>
        {children}
      </a>
    </Link>
  );
}

YTWLink.displayName = 'YTWLink';
YTWLink.propTypes = {
  href: PropTypes.string.isRequired
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
