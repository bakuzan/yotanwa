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
  center,
  highlight,
  isEnabled,
  ...props
}) {
  const timer = useRef();
  const tooltip = useRef();
  const [{ hovered, at, adjustment }, setHovered] = useState({
    hovered: false,
    at: [],
    adjustment: null
  });

  let style = usePosition ? { top: at[1], left: at[0], bottom: 'unset' } : null;

  const transform = adjustment
    ? { transform: `translateX(${adjustment}px)` }
    : {};
  style = style ? { ...style, ...transform } : { ...transform };

  function handleEnter(e) {
    const { clientX, clientY } = e;
    if (!isEnabled) {
      return;
    }

    const rect = tooltip.current.getBoundingClientRect();
    const contentWidth = tooltip.current.firstChild.offsetWidth;
    const space = window.innerWidth - (rect.width + rect.left);
    let adjustment = null;

    if (contentWidth > rect.left + rect.width / 2) {
      adjustment = -rect.left;
    } else if (space < contentWidth) {
      adjustment = -(contentWidth - space);
    }

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setHovered({ hovered: true, at: [clientX, clientY], adjustment });
    }, delay);
  }

  function handleLeave() {
    if (!isEnabled) {
      return;
    }

    clearTimeout(timer.current);
    setHovered({ hovered: false, at: [] });
  }

  return (
    <div
      ref={tooltip}
      className={classNames('tooltip', className, {
        'tooltip--hovered': hovered,
        'tooltip--highlight': highlight && hovered
      })}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      <div
        style={style}
        aria-hidden={!isEnabled}
        className={classNames('tooltip__content', {
          'tooltip__content--wrap': allowWrapping,
          'tooltip__content--fixed': usePosition,
          'tooltip__content--center': center
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
  isEnabled: true,
  allowWrapping: false,
  usePosition: false,
  center: false,
  highlight: false,
  delay: 0
};
Tooltip.propTypes = {
  isEnabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  allowWrapping: PropTypes.bool,
  usePosition: PropTypes.bool,
  delay: PropTypes.number,
  center: PropTypes.bool,
  highlight: PropTypes.bool
};

export default Tooltip;
