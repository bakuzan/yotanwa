import './Tier.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Grid from './Grid';
import Tooltip from './Tooltip';

const getListStyle = (isDraggingOver) => ({
  backgroundColor: isDraggingOver ? 'var(--alt-colour)' : ''
});

function Tier({ tier = '', scores, items, children }) {
  const classModifier = (tier !== '-' ? tier : 'unranked').toLowerCase();
  const hasScores = scores.length > 0;
  const scoreStr = scores.join('\n\r');
  const ItemTemplate = children;

  return (
    <div className="tier">
      <Tooltip
        isEnabled={hasScores}
        delay={1000}
        usePosition
        allowWrapping
        text={`Tier includes entries with the following scores:\n\r${scoreStr}`}
        className={classNames('tier__text', [
          `tier__text--tier_${classModifier}`
        ])}
      >
        {tier}
      </Tooltip>
      <Droppable droppableId={tier}>
        {(provided, snapshot) => (
          <Grid
            ref={provided.innerRef}
            className="tier__items"
            style={getListStyle(snapshot.isDraggingOver)}
            noItemsText={false}
            uniformRows
            items={items}
            footerChildren={provided.placeholder}
          >
            {(x, i) => <ItemTemplate key={x.id} index={i} data={x} />}
          </Grid>
        )}
      </Droppable>
    </div>
  );
}

Tier.displayName = 'Tier';
Tier.propTypes = {
  tier: PropTypes.string.isRequired,
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  children: PropTypes.func.isRequired
};

export default Tier;
