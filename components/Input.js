import './Input.scss';
import PropTypes from 'prop-types';
import React from 'react';

function Input({ label, ...props }) {
  return (
    <div className="form-control form-control--with-float-label">
      <input
        type="text"
        className="form-control__input"
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
