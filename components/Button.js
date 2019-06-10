import './Button.scss';
import PropTypes from 'prop-types';
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

YTWButton.displayName = 'YTWButton';
YTWButton.propTypes = {
  isPrimary: PropTypes.bool
};

export default YTWButton;
