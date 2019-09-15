import '../styles/characters.scss';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from 'meiko/Button';
import Input from 'meiko/ClearableInput';
import Grid from 'meiko/Grid';

import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { CharacterCard } from '@/components/CharacterCard';

import { useDebounce } from 'meiko/hooks/useDebounce';
import { usePrevious } from 'meiko/hooks/usePrevious';

export default function Characters() {
  const router = useRouter();
  const [searchString, setSearchString] = useState('');
  const [message, setMessage] = useState('');
  const [searchResults, setSearchResults] = useState<YTWCharacter[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<YTWCharacter[]>(
    []
  );

  const filteredSearchResults = searchResults.filter(
    (x) => !selectedCharacters.some((c) => c.id === x.id)
  );

  const debouncedSearchTerm = useDebounce(searchString, 500);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  useEffect(() => {
    async function searchForCharacter(term: string) {
      try {
        const response = await fetch(`/ytw/characters?term=${term}`);
        const result = await response.json();

        setSearchResults(result.items);
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
    setSelectedCharacters(list);
    setMessage('');
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
            value={searchString}
            onChange={(e: Event) => {
              const t = e.target as HTMLInputElement;
              setSearchString(t.value);
            }}
          />
          <Button
            className="search-container__button"
            btnStyle="primary"
            onClick={() => {
              if (selectedCharacters.length === 0) {
                setMessage('You must select at least 1 character.');
              } else {
                const characterIds = selectedCharacters
                  .map((x) => x.id)
                  .join(',');

                router.push(`/character-tier?ids=${characterIds}`);
              }
            }}
          >
            Go to tier creation
          </Button>
        </div>
        <div className="feedback">{message}</div>
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
                  const newCharacters = [...selectedCharacters, data];
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
              'characters--no-items': selectedCharacters.length === 0
            })}
            uniformRows
            noItemsText="No characters selected"
            items={selectedCharacters}
          >
            {(x: YTWCharacter) => (
              <CharacterCard
                key={x.id}
                label="Click to deselect character"
                data={x}
                onClick={(data: YTWCharacter) => {
                  const newCharacters = selectedCharacters.filter(
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
