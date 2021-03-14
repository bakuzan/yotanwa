import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Grid from 'meiko/Grid';
import Tooltip from 'meiko/Tooltip';

import CharacterList from './CharacterList';
import { YTWCharacter } from '@/interfaces/YTWCharacter';

type TierItem = {
  id: string | number;
  [key: string]: any;
};

type TierProps = {
  tier?: string;
  scores: number[];
  items: YTWCharacter[];
  children: (props: any) => any;
  isDroppable?: boolean;
};

const getListStyle = (isDraggingOver: boolean) => ({
  backgroundColor: isDraggingOver ? 'var(--alt-colour)' : ''
});

function Tier({ tier = '', scores, items, children, isDroppable }: TierProps) {
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
      {isDroppable ? (
        <Droppable droppableId={tier} direction="horizontal">
          {(provided, snapshot) => (
            <ul
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              className={classNames('tier__items', 'tier__items--bordered')}
            >
              <CharacterList showNoItemsEntry={false} items={items} />
              <div style={{ display: 'none' }}>{provided.placeholder}</div>
            </ul>
          )}
        </Droppable>
      ) : (
        <Grid
          className="tier__items"
          noItemsText={false}
          uniformRows
          items={items}
        >
          {(x: TierItem, i: number) => (
            <ItemTemplate key={x.id} index={i} data={x} />
          )}
        </Grid>
      )}
    </div>
  );
}

Tier.displayName = 'Tier';
Tier.defaultProps = {
  isDroppable: false
};
Tier.propTypes = {
  tier: PropTypes.string.isRequired,
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  children: PropTypes.func.isRequired,
  isDroppable: PropTypes.bool
};

export default Tier;
