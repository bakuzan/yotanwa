import '../styles/characters.scss';
import fetch from 'node-fetch';
import React, { useReducer } from 'react';
import {
  DropResult,
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';

import { Character } from '@/shared/interfaces/Character';
import Grid from '@/components/Grid';
import Tier from '@/components/Tier';
import CharacterCard from '@/components/CharacterCard';
import { YTWLink } from '@/components/YTWLink';

import move from '@/utils/dragAndDrop/move';
import reorder from '@/utils/dragAndDrop/reorder';

interface MoveResult {
  droppable: Character[];
  droppable2: Character[];
}

interface State {
  items: Character[];
  tier: Map<string, Character[]>;
}

function init(payload: any): State {
  return {
    items: payload.items,
    tier: ['S', 'A', 'B', 'C', 'D', 'E', 'F'].reduce(
      (p: Map<string, Character[]>, t: string) => p.set(t, []),
      new Map([])
    )
  };
}

const UPDATE = 'UPDATE';
const UPDATE_LIST = 'UPDATE_LIST';

function reducer(state: State, action: { type: string; [key: string]: any }) {
  switch (action.type) {
    case UPDATE:
      console.log('UPDATE', action);
      return state;
    case UPDATE_LIST:
      console.log('UPDATE', action);
      return state;
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

      dispatch({ type: UPDATE, key: source.droppableId, value: items });
    } else {
      const resultFromMove: MoveResult = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      dispatch({
        type: UPDATE_LIST,
        payload: [
          {
            key: source.droppableId,
            items: resultFromMove.droppable
          },
          {
            key: destination.droppableId,
            items: resultFromMove.droppable2
          }
        ]
      });
    }
  }

  console.log('RENDER TIER', items, error);
  return (
    <section className="page page--column character-tier">
      <header>
        <h1 className="character-tier__title">Character Tier</h1>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grids-container">
          <div className="tiers">
            {Array.from(state.tier).map(([tier, characters]) => (
              <Tier key={tier} tier={tier} scores={[]} items={characters} />
            ))}
          </div>
          <div className="search-selection">
            <Droppable droppableId="items">
              {(provided, snapshot) => (
                <Grid
                  ref={provided.innerRef}
                  className="characters"
                  uniformRows
                  items={state.items}
                >
                  {(x: Character, i: number) => (
                    <CharacterCard key={x.id} index={i} data={x} />
                  )}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </section>
  );
}

CharacterTier.getInitialProps = async ({ req }) => {
  const { ids = '' } = req.query;

  const response = await fetch(
    `http://localhost:7200/api/charactersByIds?ids=${ids}`
  );
  const result = await response.json();

  return { items: result.items, error: result.error };
};

export default CharacterTier;
