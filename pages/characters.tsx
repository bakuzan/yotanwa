import '../styles/characters.scss';
import classNames from 'classnames';
import React, { useEffect, useState, useReducer } from 'react';
import { useRouter } from 'next/router';

import { Button } from 'meiko/Button';
import Input from 'meiko/ClearableInput';
import Grid from 'meiko/Grid';
import fetchFromServer from 'meiko/utils/fetch';

import { useDebounce } from 'meiko/hooks/useDebounce';
import { usePrevious } from 'meiko/hooks/usePrevious';

import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { CharacterCard } from '@/components/CharacterCard';
import { AnilistMedia } from '../interfaces/AnilistMedia';

enum CharacterPageAction {
  UpdateCharacterSearchString,
  UpdateSeriesSearchString,
  LoadCharacterResults,
  UpdatecharactersSelected,
  SetMessage
}

interface CharactersState {
  characterResults: YTWCharacter[];
  charactersSelected: YTWCharacter[];
  message: string;
  searchCharacterString: string;
  searchSeriesString: string;
  seriesResults: AnilistMedia[];
}

type CharacterAction =
  | {
      type:
        | CharacterPageAction.UpdateCharacterSearchString
        | CharacterPageAction.UpdateSeriesSearchString
        | CharacterPageAction.SetMessage;
      value: string;
    }
  | {
      type:
        | CharacterPageAction.LoadCharacterResults
        | CharacterPageAction.UpdatecharactersSelected;
      items: YTWCharacter[];
    };

function reducer(state: CharactersState, action: CharacterAction) {
  switch (action.type) {
    case CharacterPageAction.SetMessage:
      return { ...state, message: action.value };

    case CharacterPageAction.UpdateCharacterSearchString:
      return { ...state, searchCharacterString: action.value };

    case CharacterPageAction.UpdateSeriesSearchString:
      return { ...state, searchSeriesString: action.value };

    case CharacterPageAction.LoadCharacterResults:
      return { ...state, characterResults: action.items };

    case CharacterPageAction.UpdatecharactersSelected:
      return { ...state, charactersSelected: action.items, message: '' };

    default:
      return state;
  }
}

export default function Characters() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    searchCharacterString: '',
    searchSeriesString: '',
    message: '',
    characterResults: [],
    seriesResults: [],
    charactersSelected: []
  });

  const filteredSearchResults = state.characterResults.filter(
    (x) => !state.charactersSelected.some((c) => c.id === x.id)
  );

  const debouncedSearchTerm = useDebounce(state.searchCharacterString, 500);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  useEffect(() => {
    async function searchForCharacter(term: string) {
      try {
        const result = await fetchFromServer(`/ytw/characters?term=${term}`);

        dispatch({
          type: CharacterPageAction.LoadCharacterResults,
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

  function updateCharacters(list: YTWCharacter[]) {
    dispatch({
      type: CharacterPageAction.UpdatecharactersSelected,
      items: list
    });
  }

  return (
    <div className="page page--column">
      <div className="search-container">
        <h1>Character Search</h1>
        <p>
          Search for and select characters you would like to use in your tiered
          list.
        </p>
        <div className="flex flex--row">
          <Input
            className="search-container__input"
            id="search"
            name="search"
            label="search"
            value={state.searchCharacterString}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const t = e.target as HTMLInputElement;
              dispatch({
                type: CharacterPageAction.UpdateCharacterSearchString,
                value: t.value
              });
            }}
          />
          <Button
            className="search-container__button"
            btnStyle="primary"
            onClick={() => {
              if (state.charactersSelected.length === 0) {
                dispatch({
                  type: CharacterPageAction.SetMessage,
                  value: 'You must select at least 1 character.'
                });
              } else {
                const characterIds = state.charactersSelected
                  .map((x) => x.id)
                  .join(',');

                router.push(`/character-tier?ids=${characterIds}`);
              }
            }}
          >
            Go to tier creation
          </Button>
        </div>
        <div className="feedback">{state.message}</div>
      </div>
      <div className="grids-container">
        <div className="search-results">
          <h2>Search Results</h2>
          <Grid
            className={classNames('characters', 'characters--no-border')}
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
                  const newCharacters = [...state.charactersSelected, data];
                  updateCharacters(newCharacters);
                }}
              />
            )}
          </Grid>
        </div>
        <div className="search-selection">
          <h2>Selected Characters</h2>
          <Grid
            className={classNames('characters characters--no-border', {
              'characters--no-items': state.charactersSelected.length === 0
            })}
            uniformRows
            noItemsText="No characters selected"
            items={state.charactersSelected}
          >
            {(x: YTWCharacter) => (
              <CharacterCard
                key={x.id}
                label="Click to deselect character"
                data={x}
                onClick={(data: YTWCharacter) => {
                  const newCharacters = state.charactersSelected.filter(
                    (c) => c.id !== data.id
                  );

                  updateCharacters(newCharacters);
                }}
              />
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
}
