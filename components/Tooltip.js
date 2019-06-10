import './Tooltip.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useState, useRef } from 'react';

function Tooltip({
  className,
  text,
  children,
  allowWrapping,
  usePosition,
  delay,
  ...props
}) {
  const [{ hovered, at }, setHovered] = useState({ hovered: false, at: [] });
  const timer = useRef();

  const style = usePosition
    ? { top: at[1], left: at[0], bottom: 'unset' }
    : null;

  function handleEnter(e) {
    const { clientX, clientY } = e;

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setHovered({ hovered: true, at: [clientX, clientY] });
    }, delay);
  }

  function handleLeave() {
    clearTimeout(timer.current);
    setHovered({ hovered: false, at: [] });
  }

  return (
    <div
      className={classNames('tooltip', className, {
        'tooltip--hovered': hovered
      })}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      <div
        style={style}
        className={classNames('tooltip__content', {
          'tooltip__content--wrap': allowWrapping,
          'tooltip__content--fixed': usePosition
        })}
      >
        {text}
      </div>
      {children}
    </div>
  );
}

Tooltip.displayName = 'Tooltip';
Tooltip.defaultProps = {
  allowWrapping: false,
  usePosition: false,
  delay: 0
};
Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  allowWrapping: PropTypes.bool,
  usePosition: PropTypes.bool,
  delay: PropTypes.number
};

export default Tooltip;
