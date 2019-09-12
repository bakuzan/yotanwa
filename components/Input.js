import './Input.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

function Input({ className, inputClassName, label, ...props }) {
  return (
    <div
      className={classNames(
        'form-control',
        'form-control--with-float-label',
        className
      )}
    >
      <input
        type="text"
        className={classNames('form-control__input', inputClassName)}
        placeholder=" "
        {...props}
      />
      <label htmlFor={props.id} className="form-control__label">
        {label}
      </label>
    </div>
  );
}

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func
};

export default Input;
