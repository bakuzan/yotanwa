/* tslint:disable:object-literal-sort-keys */
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useReducer, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { Button } from 'meiko/Button';
import Input from 'meiko/ClearableInput';
import LoadingBouncer from 'meiko/LoadingBouncer';
import fetchFromServer from 'meiko/utils/fetch';

import { CharacterCardDraggable } from '@/components/CharacterCard';
import CharacterList from '@/components/CharacterList';
import CopyToClipboard from '@/components/CopyToClipboard';
import ErrorInPage from '@/components/ErrorInPage';
import Tier from '@/components/Tier';

import { Tiers } from '@/consts';
import { CharacterAssignmentModel } from '@/interfaces/CharacterAssignmentModel';
import { MovePayload } from '@/interfaces/MovePayload';
import { TierModel } from '@/interfaces/TierModel';
import { TierResponse } from '@/interfaces/TierResponse';
import { YTWCharacter } from '@/interfaces/YTWCharacter';
import move from '@/utils/dragAndDrop/move';
import reorder from '@/utils/dragAndDrop/reorder';
import fetchOnServer from '@/utils/fetch';
import isClient from '@/utils/isClient';

const getListStyle = (isDraggingOver: boolean) => ({
  backgroundColor: isDraggingOver ? 'var(--alt-colour)' : ''
});

function getList(state: State, key: string) {
  if (key === 'items') {
    return state.items;
  }

  return state.tier.get(key) || [];
}

interface Props {
  error?: string;
  items: YTWCharacter[];
  tier?: TierModel;
}

interface Action {
  type: string;
  [key: string]: any;
}

interface State {
  id?: string;
  isLoading: boolean;
  items: YTWCharacter[];
  name: string;
  tier: Map<string, YTWCharacter[]>;
}

function init({ items, tier }: Props): State {
  let values = {};

  if (tier) {
    const characters = items as YTWCharacter[];
    const characterState = tier.characterState as CharacterAssignmentModel[];

    values = {
      id: tier.id,
      items: characters.filter((c) =>
        characterState.some(
          (s) => s.characterId === c.id && s.assignment === 'Unassigned'
        )
      ),
      name: tier.name,
      tier: Tiers.reduce(
        (p: Map<string, YTWCharacter[]>, t: string) =>
          p.set(t, [
            ...characters.filter((c) =>
              characterState.some(
                (s) => s.characterId === c.id && s.assignment === t
              )
            )
          ]),
        new Map([])
      )
    };
  }

  return {
    id: undefined,
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

function CharacterTier({ items, tier, error }: Props) {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const [state, dispatch] = useReducer<(s: State, a: Action) => State, any>(
    reducer,
    { items, tier },
    init
  );

  if (error) {
    return <ErrorInPage error={error} />;
  }

  function onDragEnd(result: DropResult): void {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const cards = reorder(
        getList(state, source.droppableId),
        source.index,
        destination.index
      );

      dispatch({
        type: UPDATE,
        payload: [{ key: source.droppableId, items: cards }]
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
    setFeedback('');

    const result = await fetchFromServer(`/ytw/tier`, 'POST', {
      characterState: [
        ...Array.from(state.tier.entries()).reduce(
          (p, [t, list]) => [
            ...p,
            ...list.map(
              (c) =>
                ({
                  characterId: c.id,
                  assignment: t
                } as CharacterAssignmentModel)
            )
          ],
          [] as CharacterAssignmentModel[]
        ),
        ...state.items.map((x) => ({
          characterId: x.id,
          assignment: 'Unassigned'
        }))
      ],
      id: state.id,
      name: state.name
    });

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
        <h1 className="character-tier__title">
          Character Tier{' '}
          <div>
            {state.id && (
              <CopyToClipboard
                name="tier link"
                text={isClient() ? window.location.href : ''}
              />
            )}
          </div>
        </h1>
        <div>
          <div className="save-block">
            {state.isLoading && <LoadingBouncer />}
            <Button
              className="save-block__button"
              btnStyle="primary"
              onClick={onSave}
            >
              Save
            </Button>
            <Button
              className="save-block__button"
              btnStyle="accent"
              onClick={() => {
                const characterIds = [
                  ...Array.from(state.tier.values()).reduce((p, c) => [
                    ...p,
                    ...c
                  ]),
                  ...state.items
                ]
                  .map((x) => x.id)
                  .join(',');

                router.push(`/characters?ids=${characterIds}`);
              }}
            >
              {state.id ? 'Clone' : 'Back'}
            </Button>
            {state.id && (
              <Button
                className="save-block__button"
                btnStyle="accent"
                onClick={() => router.push(`/characters?id=${state.id}`)}
              >
                Add/Remove characters
              </Button>
            )}
          </div>
          {!state.isLoading && <div className="feedback">{feedback}</div>}
        </div>
      </header>

      <div>
        <Input
          id="name"
          name="name"
          label="Tier name"
          value={state.name}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const t = e.target as HTMLInputElement;
            dispatch({ type: UPDATE_NAME, value: t.value });
          }}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grids-container">
          <div className="character-tiers character-tiers--wide">
            {Array.from(state.tier.entries()).map(([t, characters]) => (
              <Tier key={t} isDroppable tier={t} scores={[]} items={characters}>
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
            <Droppable droppableId="items" direction="horizontal">
              {(provided, snapshot) => (
                <ul
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  className={classNames(
                    'card-grid',
                    'character-selection__list',
                    { 'card-grid--no-items': state.items.length === 0 }
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
      <footer className="character-tier-footer">
        {state.id && (
          <Button
            className="character-tier-footer__delete"
            onClick={async () => {
              const response = await fetchFromServer(
                `/ytw/tier/${state.id}`,
                'DELETE'
              );

              if (response.success) {
                const url = `/characters`;
                router.push(url, url);
              } else {
                const errorMessage =
                  typeof response.error === 'string'
                    ? response.error
                    : response.error.message;

                setFeedback(errorMessage);
              }
            }}
          >
            Delete {state.name}
          </Button>
        )}
      </footer>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const queryBase = process.env.API_URL_BASE;

  const { id = '' } = context.query;
  let { ids = '' } = context.query;
  let error = '';
  let tier = undefined;
  let items = [];

  if (id) {
    const tierResult = await fetchOnServer<TierResponse>(
      `${queryBase}/ytw/tier/${id}`
    );

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
    const result = await fetchOnServer(
      `${queryBase}/api/charactersByIds?ids=${ids}`
    );

    items = result.items || [];
    error = result.error || '';
  }

  return { props: { items, tier, error } };
};

export default CharacterTier;
