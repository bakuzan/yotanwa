import '../styles/characters.scss';
import fetch from 'node-fetch';
import classNames from 'classnames';
import React, { useReducer, useState } from 'react';
import { DropResult, DragDropContext, Droppable } from 'react-beautiful-dnd';

import { Button } from 'meiko/Button';
import Input from 'meiko/ClearableInput';
import LoadingBouncer from 'meiko/LoadingBouncer';

import { YTWCharacter } from '../interfaces/YTWCharacter';
import { CharacterAssignmentModel } from '../interfaces/CharacterAssignmentModel';
import { CharacterCardDraggable } from '@/components/CharacterCard';
import CharacterList from '@/components/CharacterList';
import Tier from '@/components/Tier';
import { YTWLink } from '@/components/YTWLink';

import { Tiers } from '../consts';
import move from '@/utils/dragAndDrop/move';
import reorder from '@/utils/dragAndDrop/reorder';
import { MovePayload } from '../interfaces/MovePayload';
import { useRouter } from 'next/router';

const getListStyle = (isDraggingOver: boolean) => ({
  backgroundColor: isDraggingOver ? 'var(--alt-colour)' : ''
});

function getList(state: State, key: string) {
  if (key === 'items') {
    return state.items;
  }

  return state.tier.get(key);
}

type Action = { type: string; [key: string]: any };

interface State {
  id?: string;
  isLoading: boolean;
  items: YTWCharacter[];
  name: string;
  tier: Map<string, YTWCharacter[]>;
}

function init({ items, tier }): State {
  let values = {};

  if (tier) {
    const characters = items as YTWCharacter[];
    const characterState = tier.characterState as CharacterAssignmentModel[];

    values = {
      id: tier.id,
      name: tier.name,
      items: characters.filter((c) =>
        characterState.some(
          (s) => s.characterId === c.id && s.tier === 'Unassigned'
        )
      ),
      tier: Tiers.reduce(
        (p: Map<string, YTWCharacter[]>, t: string) =>
          p.set(t, [
            ...characters.filter((c) =>
              characterState.some((s) => s.characterId === c.id && s.tier === t)
            )
          ]),
        new Map([])
      )
    };
  }

  return {
    id: null,
    isLoading: false,
    items,
    name: '',
    tier: Tiers.reduce(
      (p: Map<string, YTWCharacter[]>, t: string) => p.set(t, []),
      new Map([])
    ),
    ...values
  };
}

const UPDATE_NAME = 'UPDATE_NAME';
const UPDATE = 'UPDATE';
const SAVED = 'SAVED';
const LOADING = 'LOADING';

function reducer(state: State, action: Action) {
  switch (action.type) {
    case LOADING:
      return { ...state, isLoading: !state.isLoading };
    case UPDATE_NAME:
      return { ...state, name: action.value };
    case UPDATE:
      return action.payload.reduce((p: State, up: MovePayload) => {
        if (up.key === 'items') {
          return { ...p, items: up.items };
        }

        return { ...p, tier: p.tier.set(up.key, up.items) };
      }, state);
    case SAVED:
      return { ...state, id: action.value };
    default:
      return state;
  }
}

function CharacterTier({ items, tier, error }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const [state, dispatch] = useReducer<(s: State, a: Action) => State, any>(
    reducer,
    { items, tier },
    init
  );

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

  function onDragEnd(result: DropResult): void {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(state, source.droppableId),
        source.index,
        destination.index
      );

      dispatch({
        type: UPDATE,
        payload: [{ key: source.droppableId, items }]
      });
    } else {
      const payload = move(
        getList(state, source.droppableId),
        getList(state, destination.droppableId),
        source,
        destination
      );

      dispatch({
        type: UPDATE,
        payload
      });
    }
  }

  async function onSave() {
    dispatch({ type: LOADING });

    const body = JSON.stringify({
      id: state.id,
      name: state.name,
      characterState: [
        ...Array.from(state.tier.entries()).reduce(
          (p, [t, list]) => [
            ...p,
            ...list.map((c) => ({ characterId: c.id, assignment: t }))
          ],
          []
        ),
        ...state.items.map((x) => ({
          characterId: x.id,
          assignment: 'Unassigned'
        }))
      ]
    });

    const response = await fetch(`/ytw/tier`, {
      body,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    const result = await response.json();

    if (result.success) {
      dispatch({ type: SAVED, value: result.id });

      if (!router.query.id) {
        const href = `/character-tier?id=${result.id}`;
        router.push(href, href, { shallow: true });
      }
    } else {
      setFeedback(result.error);
    }

    dispatch({ type: LOADING });
  }

  return (
    <section className="page page--column character-tier">
      <header className="character-tier__header">
        <h1 className="character-tier__title">Character Tier</h1>
        <div className="save-block">
          {state.isLoading && <LoadingBouncer />}
          {!state.isLoading && <div className="feedback">{feedback}</div>}
          <Button
            className="save-block__button"
            btnStyle="primary"
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </header>
      <div>
        <Input
          id="name"
          name="name"
          label="Tier name"
          value={state.name}
          onChange={(e: Event) => {
            const t = e.target as HTMLInputElement;
            dispatch({ type: UPDATE_NAME, value: t.value });
          }}
        />
      </div>
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
  const queryBase = process.env.API_URL_BASE;

  let { id = '', ids = '' } = query;
  let error = '',
    tier = null,
    items = [];

  if (id) {
    const tierResponse = await fetch(`${queryBase}/ytw/tier/${id}`);
    const tierResult = await tierResponse.json();

    if (tierResult.success) {
      tier = tierResult.tier;
      ids = tier.characterState
        .map((x: CharacterAssignmentModel) => x.characterId)
        .join(',');
    } else {
      error = tierResult.error;
    }
  }

  if (ids) {
    const response = await fetch(`${queryBase}/api/charactersByIds?ids=${ids}`);

    const result = await response.json();

    items = result.items;
    error = result.error;
  }

  return { items, tier, error };
};

export default CharacterTier;
