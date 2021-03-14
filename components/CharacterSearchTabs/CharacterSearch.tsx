import classNames from 'classnames';
import React, { useEffect, useReducer } from 'react';

import Grid from 'meiko/Grid';
import Input from 'meiko/ClearableInput';
import fetchFromServer from 'meiko/utils/fetch';

import { useDebounce } from 'meiko/hooks/useDebounce';
import { usePrevious } from 'meiko/hooks/usePrevious';

import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { CharacterCard } from '@/components/CharacterCard';
import {
  SearchProps,
  SearchState,
  SearchAction,
  SearchTabAction
} from './common';

function reducer(state: SearchState, action: SearchAction) {
  switch (action.type) {
    case SearchTabAction.UpdateSearchString:
      return { ...state, searchString: action.value };

    case SearchTabAction.LoadResults:
      return { ...state, results: action.items };

    default:
      return state;
  }
}

export default function CharacterSearch(props: SearchProps) {
  const [state, dispatch] = useReducer(reducer, {
    results: [],
    searchString: ''
  });

  const filteredSearchResults = state.results.filter(
    (x) => !props.selectedCharacters.some((c) => c.id === x.id)
  );

  const debouncedSearchTerm = useDebounce(state.searchString, 500);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  useEffect(() => {
    async function searchForCharacter(term: string) {
      try {
        const result = await fetchFromServer(`/ytw/characters?term=${term}`);

        dispatch({
          type: SearchTabAction.LoadResults,
          items: result.items
        });
      } catch (e) {
        // TODO handle this
      }
    }

    const hasNewSearchTerm = debouncedSearchTerm !== prevSearchTerm;

    if (debouncedSearchTerm && hasNewSearchTerm) {
      searchForCharacter(debouncedSearchTerm);
    }
  }, [prevSearchTerm, debouncedSearchTerm]);

  return (
    <div className="search-panel">
      <Input
        className="search-panel__input"
        id="search"
        name="search"
        label="search"
        value={state.searchString}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          const t = e.target as HTMLInputElement;
          dispatch({
            type: SearchTabAction.UpdateSearchString,
            value: t.value
          });
        }}
      />
      <Grid
        className={classNames('card-grid', 'card-grid--no-border')}
        uniformRows
        noItemsText={false}
        items={filteredSearchResults}
      >
        {(x: YTWCharacter) => (
          <CharacterCard
            key={x.id}
            label="Click to select character"
            data={x}
            onClick={(data: YTWCharacter) => {
              const newCharacters = [...props.selectedCharacters, data];
              props.onUpdate(newCharacters);
            }}
          />
        )}
      </Grid>
    </div>
  );
}
