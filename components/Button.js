import './Button.scss';
import classNames from 'classnames';
import React from 'react';

function YTWButton({ className, isPrimary, children, ...props }) {
  return (
    <button
      type="button"
      className={classNames(
        'button',
        { 'button--primary': isPrimary },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default YTWButton;
