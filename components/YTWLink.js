import './YTWLink.scss';
import classNames from 'classnames';
import React from 'react';
import Link from 'next/link';

export function YTWLink({ className, href, children, ...props }) {
  return (
    <Link href={href}>
      <a {...props} className={classNames('ytw-link', className)}>
        {children}
      </a>
    </Link>
  );
}

export function NewTabLink({ children, ...props }) {
  return (
    <YTWLink {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </YTWLink>
  );
}
