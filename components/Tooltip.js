import './Tooltip.scss';
import classNames from 'classnames';
import React, { useState } from 'react';

function Tooltip({ className, text, children, ...props }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li
      className={classNames('tooltip', className, {
        'tooltip--hovered': hovered
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <div className="tooltip__content">{text}</div>
      {children}
    </li>
  );
}

export default Tooltip;
