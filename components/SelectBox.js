import './Input.scss';
import './SelectBox.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

const SelectBox = ({
  containerClassName,
  className,
  label,
  options,
  children,
  ...props
}) => {
  const hasChildren = !!children;
  const isFn = typeof children === 'function';

  return (
    <div
      className={classNames(
        'select-container',
        'form-control form-control--with-float-label',
        containerClassName
      )}
    >
      <select className={classNames('select-box', className)} {...props}>
        {hasChildren && isFn && options.map(children)}
        {hasChildren && !isFn && children}
        {!hasChildren &&
          options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          ))}
      </select>
      <label htmlFor={props.id} className="form-control__label">
        {label}
      </label>
    </div>
  );
};

SelectBox.displayName = 'SelectBox';
SelectBox.defaultProps = {
  disabled: false,
  children: null
};

SelectBox.propTypes = {
  id: PropTypes.string.isRequired,
  containerClassName: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]).isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

export default SelectBox;
