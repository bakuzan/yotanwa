import './Grid.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

const Grid = React.forwardRef(function Grid(
  {
    className,
    items,
    noItemsText,
    uniformRows,
    children,
    footerChildren,
    ...other
  },
  ref
) {
  const passedNothing = !items;
  const hasItems = !passedNothing && items.length > 0;
  const preventNoItemsText = noItemsText === false;

  return (
    <ul
      ref={ref}
      className={classNames(
        'ytw-grid',
        {
          'ytw-grid--uniform-rows': uniformRows,
          'ytw-grid--no-items': !hasItems
        },
        className
      )}
      {...other}
    >
      {!passedNothing && !hasItems && !preventNoItemsText && (
        <li key="NONE" className="ytw-grid__no-items-message">
          {noItemsText}
        </li>
      )}
      {hasItems && children && items.map(children)}
      {footerChildren}
    </ul>
  );
});

Grid.displayName = 'Grid';
Grid.defaultProps = {
  noItemsText: 'No items',
  uniformRows: false,
  footerChildren: null
};

Grid.propTypes = {
  children: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.any),
  noItemsText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  uniformRows: PropTypes.bool,
  footerChildren: PropTypes.oneOfType([PropTypes.node, PropTypes.element])
};

export default Grid;
