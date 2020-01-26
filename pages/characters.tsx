import '../styles/characters.scss';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from 'meiko/Button';
import Grid from 'meiko/Grid';
import Tabs from 'meiko/Tabs';

import CharacterSearch from '../components/CharacterSearchTabs/CharacterSearch';
import SeriesSearch from '../components/CharacterSearchTabs/SeriesSearch';

import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { CharacterCard } from '@/components/CharacterCard';

export default function Characters() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<YTWCharacter[]>(
    []
  );

  function updateSelected(list: YTWCharacter[]) {
    setSelectedCharacters(list);
    setMessage('');
  }

  return (
    <div className="page page--column">
      <div className="search-container">
        <h1>Character Search</h1>

        <div className="flex flex--row flex--space-between">
          <p>
            Search for and select characters you would like to use in your
            tiered list.
          </p>
          <Button
            className="search-container__button"
            btnStyle="primary"
            aria-label="Go to tier creation using the currently selected characters"
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
          <Tabs.Container>
            <Tabs.View displayName="By Character" name="character">
              {(isActive) =>
                isActive && (
                  <CharacterSearch
                    selectedCharacters={selectedCharacters}
                    onUpdate={updateSelected}
                  />
                )
              }
            </Tabs.View>
            <Tabs.View displayName="By Series" name="series">
              {(isActive) =>
                isActive && (
                  <SeriesSearch
                    selectedCharacters={selectedCharacters}
                    onUpdate={updateSelected}
                  />
                )
              }
            </Tabs.View>
          </Tabs.Container>
        </div>
        <div className="search-selection">
          <h2>Selected Characters</h2>
          <Grid
            className={classNames('card-grid card-grid--no-border', {
              'card-grid--no-items': selectedCharacters.length === 0
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

                  setSelectedCharacters(newCharacters);
                }}
              />
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
}
