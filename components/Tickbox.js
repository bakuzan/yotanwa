import './Tickbox.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

function Tickbox({ containerClassName, className, text, ...props }) {
  return (
    <div className={classNames('tickbox', containerClassName)}>
      <label
        className={classNames('tickbox__label', {
          'tickbox__label--disabled': props.disabled
        })}
        htmlFor={props.id}
      >
        <input
          type="checkbox"
          className={classNames('tickbox__input', className)}
          {...props}
        />
        {text || ''}
      </label>
    </div>
  );
}

Tickbox.displayName = 'Tickbox';
Tickbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string
};

export default Tickbox;
