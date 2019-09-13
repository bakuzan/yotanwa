import '../styles/characters.scss';
import fetch from 'node-fetch';
import classNames from 'classnames';
import React, { useReducer } from 'react';

import { DropResult, DragDropContext, Droppable } from 'react-beautiful-dnd';

import { YTWCharacter } from '@/interfaces/YTWCharacter';
import Button from '@/components/Button';
import { CharacterCardDraggable } from '@/components/CharacterCard';
import CharacterList from '@/components/CharacterList';
import Tier from '@/components/Tier';
import { YTWLink } from '@/components/YTWLink';

import move from '@/utils/dragAndDrop/move';
import reorder from '@/utils/dragAndDrop/reorder';
import { MovePayload } from '../interfaces/MovePayload';

const getListStyle = (isDraggingOver: boolean) => ({
  backgroundColor: isDraggingOver ? 'var(--alt-colour)' : ''
});

interface State {
  items: YTWCharacter[];
  tier: Map<string, YTWCharacter[]>;
}

function init(payload: any): State {
  return {
    items: payload.items,
    tier: ['S', 'A', 'B', 'C', 'D', 'E', 'F'].reduce(
      (p: Map<string, YTWCharacter[]>, t: string) => p.set(t, []),
      new Map([])
    )
  };
}

const UPDATE = 'UPDATE';

function reducer(state: State, action: { type: string; [key: string]: any }) {
  switch (action.type) {
    case UPDATE:
      return action.payload.reduce((p: State, up: MovePayload) => {
        if (up.key === 'items') {
          return { ...p, items: up.items };
        }

        return { ...p, tier: p.tier.set(up.key, up.items) };
      }, state);
    default:
      return state;
  }
}

function CharacterTier({ items, error }) {
  const [state, dispatch] = useReducer(reducer, { items }, init);

  if (error) {
    // TODO handler error
    return (
      <div className="page page--column">
        <div>{error}</div>
        <div>
          <YTWLink href="/characters">Return to character selection</YTWLink>
        </div>
      </div>
    );
  }

  function getList(key: string) {
    if (key === 'items') {
      return state.items;
    }

    return state.tier.get(key);
  }

  function onDragEnd(result: DropResult): void {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      dispatch({
        type: UPDATE,
        payload: [{ key: source.droppableId, items }]
      });
    } else {
      const payload = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      dispatch({
        type: UPDATE,
        payload
      });
    }
  }

  return (
    <section className="page page--column character-tier">
      <header className="character-tier__header">
        <h1 className="character-tier__title">Character Tier</h1>
        <Button
          className="character-tier__save"
          isPrimary
          onClick={() => console.log('SAVE NOT IMPLEMENTED')}
        >
          Save
        </Button>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grids-container">
          <div className="tiers tiers--wide">
            {Array.from(state.tier.entries()).map(([tier, characters]) => (
              <Tier
                key={tier}
                isDroppable
                tier={tier}
                scores={[]}
                items={characters}
              >
                {({ index, data }) => (
                  <CharacterCardDraggable
                    key={data.id}
                    index={index}
                    data={data}
                  />
                )}
              </Tier>
            ))}
          </div>
          <div className="character-selection">
            <Droppable droppableId="items">
              {(provided, snapshot) => (
                <ul
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  className={classNames(
                    'characters',
                    'character-selection__list',
                    { 'characters--no-items': state.items.length === 0 }
                  )}
                >
                  <CharacterList items={state.items} />
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </section>
  );
}

CharacterTier.getInitialProps = async ({ query }) => {
  const { ids = '' } = query;

  const response = await fetch(
    `${process.env.API_URL_BASE}/api/charactersByIds?ids=${ids}`
  );
  const result = await response.json();

  return { items: result.items, error: result.error };
};

export default CharacterTier;
