import './CharacterCard.scss';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { YTWCharacter } from '../interfaces/YTWCharacter';
import { Button } from 'meiko/Button';
// import Tooltip from 'meiko/Tooltip';
import TTooltip from './Tooltip';

import Image from './Image';

import { width, height } from '../consts/imageSize';

type CharacterCardProps = Omit<HTMLAttributes<HTMLLIElement>, 'onClick'> & {
  label?: string;
  data: YTWCharacter;
  onClick?: (c: YTWCharacter) => void;
};

const getItemStyle = (draggableStyle: any, isDragging: boolean) => ({
  cursor: 'grab',
  userSelect: 'none',
  boxShadow: isDragging ? '1px 1px 5px 1px var(--alt-colour)' : '',
  ...draggableStyle
});

const CharacterCardBase = React.forwardRef<HTMLLIElement, CharacterCardProps>(
  function CharacterCardBase({ label, data, onClick, ...props }, ref) {
    const clickHandler = onClick ? () => onClick(data) : undefined;
    const ActionItem = clickHandler ? Button : 'div';

    return (
      <li className="character" ref={ref} {...props}>
        <TTooltip text={data.name} center highlight>
          <ActionItem
            className={classNames('character__button', {
              'character__button--no-click': !clickHandler
            })}
            aria-label={label}
            onClick={clickHandler}
          >
            <Image
              src={data.image}
              alt={data.name}
              width={width}
              height={height}
              isLazy
            />
          </ActionItem>
        </TTooltip>
      </li>
    );
  }
);

CharacterCardBase.displayName = 'CharacterCard';

export const CharacterCard = CharacterCardBase;

export function CharacterCardDraggable({
  index,
  ...props
}: CharacterCardProps & { index: number }) {
  return (
    <Draggable draggableId={`${props.data.id}`} index={index}>
      {(providedDraggable, snapshotDraggable) => (
        <CharacterCardBase
          {...props}
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          {...providedDraggable.dragHandleProps}
          style={getItemStyle(
            providedDraggable.draggableProps.style,
            snapshotDraggable.isDragging
          )}
        />
      )}
    </Draggable>
  );
}
