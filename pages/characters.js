import '../styles/characters.scss';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Button from '../components/Button';
import Grid from '../components/Grid';
import Input from '../components/Input';
import { CharacterCard } from '@/components/CharacterCard';

import { useDebounce } from '../hooks/useDebounce';
import { usePrevious } from '../hooks/usePrevious';

export default function Characters() {
  const router = useRouter();
  const [searchString, setSearchString] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');

  const filteredSearchResults = searchResults.filter(
    (x) => !selectedCharacters.some((c) => c.id === x.id)
  );

  const debouncedSearchTerm = useDebounce(searchString, 500);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  useEffect(() => {
    async function searchForCharacter(term) {
      try {
        const response = await fetch(`/ytw/characters?term=${term}`);
        const result = await response.json();
        console.log('Character search > ', result);
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

  function updateCharacters(list) {
    setSelectedCharacters(list);
    setMessage('');
  }

  return (
    <div className="page page--column">
      <div className="search-container">
        <h1>Tier List Character Search</h1>
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
            onChange={(e) => setSearchString(e.target.value)}
          />
          <Button
            className="search-container__button"
            isPrimary
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
          <Grid
            className="characters"
            uniformRows
            noItemsText={false}
            items={filteredSearchResults}
          >
            {(x) => (
              <CharacterCard
                key={x.id}
                label="Click to select character"
                data={x}
                onClick={(data) => {
                  const newCharacters = [...selectedCharacters, data];
                  updateCharacters(newCharacters);
                }}
              />
            )}
          </Grid>
        </div>
        <div className="search-selection">
          <Grid
            className="characters"
            uniformRows
            noItemsText="No characters selected"
            items={selectedCharacters}
          >
            {(x) => (
              <CharacterCard
                key={x.id}
                label="Click to deselect character"
                data={x}
                onClick={(data) => {
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
