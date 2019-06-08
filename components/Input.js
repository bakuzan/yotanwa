import './Input.scss';
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

export default Input;
