import './Grid.scss';
import classNames from 'classnames';
import React from 'react';

function Grid({
  className,
  items,
  noItemsText,
  uniformRows,
  children,
  ...other
}) {
  const passedNothing = !items;
  const hasItems = !passedNothing && items.length > 0;

  return (
    <ul
      className={classNames(
        'ytw-grid',
        { 'ytw-grid--uniform-rows': uniformRows },
        className
      )}
      {...other}
    >
      {!passedNothing && !hasItems && (
        <li key="NONE" className="ytw-grid__no-items-message">
          {noItemsText}
        </li>
      )}
      {hasItems && children && items.map(children)}
    </ul>
  );
}

Grid.defaultProps = {
  noItemsText: 'No items'
};

export default Grid;
