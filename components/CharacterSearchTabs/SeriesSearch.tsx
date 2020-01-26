import classNames from 'classnames';
import React, { useEffect, useReducer } from 'react';

import Grid from 'meiko/Grid';
import Input from 'meiko/ClearableInput';
import fetchFromServer from 'meiko/utils/fetch';

import { useDebounce } from 'meiko/hooks/useDebounce';
import { usePrevious } from 'meiko/hooks/usePrevious';
import { useProgressiveLoading } from 'meiko/hooks/useProgressiveLoading';

import MediaCard from '../MediaCard';
import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { CharacterCard } from '@/components/CharacterCard';
import { AnilistMedia } from '@/interfaces/AnilistMedia';
import distinct from '../../utils/distinct';

import {
  SearchProps,
  SearchState,
  SearchAction,
  SearchTabAction
} from './common';

import './SearchTabs.scss';

interface SeriesSearchState extends SearchState {
  loading: boolean;
  page: number;
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
    }
  | { type: SearchTabAction.NextPage };

function reducer(state: SeriesSearchState, action: SeriesSearchAction) {
  console.log(
    '%c Reduce > ',
    'color: magenta; font-size: 18px;',
    state,
    action
  );
  switch (action.type) {
    case SearchTabAction.UpdateSearchString:
      return { ...state, searchString: action.value };

    case SearchTabAction.NextPage: {
      if (state.page < 0) {
        return state;
      }

      return { ...state, loading: true, page: state.page + 1 };
    }

    case SearchTabAction.LoadResults: {
      const count = action.items.length;
      const page = count < 20 ? -1 : state.page;

      return {
        ...state,
        loading: false,
        page,
        results:
          state.page === 1
            ? action.items
            : distinct(
                [...state.results, ...action.items],
                (a, b) => a.id === b.id
              )
      };
    }

    case SearchTabAction.LoadSeries:
      return { ...state, page: 1, results: [], selectedSeries: action.item };

    case SearchTabAction.LoadSeriesResults:
      return { ...state, seriesResults: action.items };

    default:
      return state;
  }
}

export default function SeriesSearch(props: SearchProps) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    page: 1,
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
    async function fetchSeriesCharacters(seriesId: number, page: number) {
      try {
        const result = await fetchFromServer(
          `/ytw/seriescharacters/${seriesId}?page=${page}`
        );

        dispatch({
          type: SearchTabAction.LoadResults,
          items: result.items,
          page
        });
      } catch (e) {
        // TODO handle this
      }
    }

    if (selectedSeries && state.page > 0) {
      fetchSeriesCharacters(selectedSeries.id, state.page);
    }
  }, [selectedSeries, state.page]);

  const ref = useProgressiveLoading<HTMLUListElement>(() => {
    if (!state.loading) {
      dispatch({ type: SearchTabAction.NextPage });
    }
  });
  console.log('RENDER', state, ref);
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
            ref={ref}
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
