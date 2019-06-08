import './Input.scss';
import './RadioGroup.scss';
import React from 'react';

function RadioGroup({ label, options, ...props }) {
  return (
    <div className="radio-group">
      <div className="radio-group__label">{label}</div>
      <div className="radio-group__options">
        {options.map(({ label: opLabel, ...op }) => {
          return (
            <div key={op.value} className="form-control">
              <label className="form-control__label radio">
                <input
                  type="radio"
                  className="form-control__input radio__input"
                  {...props}
                  {...op}
                />
                <span className="radio__label">{opLabel}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RadioGroup;
