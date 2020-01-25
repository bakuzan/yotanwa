import classNames from 'classnames';
import React, { useEffect, useReducer } from 'react';

import Grid from 'meiko/Grid';
import Input from 'meiko/ClearableInput';
import fetchFromServer from 'meiko/utils/fetch';

import { useDebounce } from 'meiko/hooks/useDebounce';
import { usePrevious } from 'meiko/hooks/usePrevious';

import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { CharacterCard } from '@/components/CharacterCard';
import { AnilistMedia } from '@/interfaces/AnilistMedia';

import MediaCard from '../MediaCard';
import {
  SearchProps,
  SearchState,
  SearchAction,
  SearchTabAction
} from './common';

import './SearchTabs.scss';

interface SeriesSearchState extends SearchState {
  selectedSeries: AnilistMedia | null;
  searchString: string;
  seriesResults: AnilistMedia[];
}

type SeriesSearchAction =
  | SearchAction
  | {
      type: SearchTabAction.LoadSeriesResults;
      items: AnilistMedia[];
    }
  | {
      type: SearchTabAction.LoadSeries;
      item: AnilistMedia | null;
    };

function reducer(state: SeriesSearchState, action: SeriesSearchAction) {
  switch (action.type) {
    case SearchTabAction.UpdateSearchString:
      return { ...state, searchString: action.value };

    case SearchTabAction.LoadResults:
      return { ...state, results: action.items };

    case SearchTabAction.LoadSeries:
      return { ...state, results: [], selectedSeries: action.item };

    case SearchTabAction.LoadSeriesResults:
      return { ...state, seriesResults: action.items };

    default:
      return state;
  }
}

export default function SeriesSearch(props: SearchProps) {
  const [state, dispatch] = useReducer(reducer, {
    results: [],
    searchString: '',
    selectedSeries: null,
    seriesResults: []
  });

  const selectedSeries = state.selectedSeries;
  const filteredSearchResults = state.results.filter(
    (x) => !props.selectedCharacters.some((c) => c.id === x.id)
  );

  const debouncedSearchTerm = useDebounce(state.searchString, 500);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  useEffect(() => {
    async function searchSeries(term: string) {
      try {
        const result = await fetchFromServer(`/ytw/series?term=${term}`);

        dispatch({
          type: SearchTabAction.LoadSeriesResults,
          items: result.items
        });
      } catch (e) {
        // TODO handle this
      }
    }

    const hasNewSearchTerm = debouncedSearchTerm !== prevSearchTerm;

    if (debouncedSearchTerm && hasNewSearchTerm) {
      searchSeries(debouncedSearchTerm);
    }
  }, [prevSearchTerm, debouncedSearchTerm]);

  useEffect(() => {
    async function fetchSeriesCharacters() {
      // TODO
      // Remember to make character list progressive load new pages.
      console.log(' Fetch page for series characters no implemented yet!');
    }

    if (selectedSeries) {
      fetchSeriesCharacters();
    }
  }, [selectedSeries]);

  return (
    <div className="search-panel">
      {selectedSeries == null ? (
        <React.Fragment>
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
            className="card-grid card-grid--no-border"
            uniformRows
            noItemsText={false}
            items={state.seriesResults}
          >
            {(x: AnilistMedia) => (
              <MediaCard
                key={x.id}
                className="series"
                data={x}
                label="Click to select series and series for characters within it."
                listItem
                onClick={(item) =>
                  dispatch({
                    type: SearchTabAction.LoadSeries,
                    item
                  })
                }
              />
            )}
          </Grid>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <MediaCard
            className="selected-series"
            data={selectedSeries}
            label={'Click to remove series selection'}
            showName
            onClick={() =>
              dispatch({
                type: SearchTabAction.LoadSeries,
                item: null
              })
            }
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
        </React.Fragment>
      )}
    </div>
  );
}
