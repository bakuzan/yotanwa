import '../styles/characters.scss';
import classNames from 'classnames';
import React, { useState } from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';

import { Button } from 'meiko/Button';
import Grid from 'meiko/Grid';
import Tabs from 'meiko/Tabs';
import fetchFromServer from 'meiko/utils/fetch';

import CharacterSearch from '@/components/CharacterSearchTabs/CharacterSearch';
import SeriesSearch from '@/components/CharacterSearchTabs/SeriesSearch';
import { CharacterCard } from '@/components/CharacterCard';
import ErrorInPage from '@/components/ErrorInPage';

import { CharacterAssignmentModel } from '@/interfaces/CharacterAssignmentModel';
import { TierModel } from '@/interfaces/TierModel';
import { YTWCharacter } from '@/interfaces/YTWCharacter';

import fetchOnServer from '@/utils/fetch';

interface Props {
  error?: string;
  isEdit: boolean;
  items: YTWCharacter[];
  tier?: TierModel;
}

function Characters(props: Props) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<YTWCharacter[]>(
    []
  );

  if (props.error) {
    return <ErrorInPage error={props.error} />;
  }

  function updateSelected(list: YTWCharacter[]) {
    setSelectedCharacters(list);
    setMessage('');
  }

  async function onSubmit() {
    if (selectedCharacters.length === 0) {
      return setMessage('You must select at least 1 character.');
    }

    const tier = props.tier as TierModel;
    const states = tier.characterState;

    const result = await fetchFromServer(`/ytw/tier`, 'POST', {
      id: tier.id,
      name: tier.name,
      characterState: selectedCharacters.map((x) => {
        const state = states.find((x) => x.characterId === x.id);
        const assignment = state?.assignment || 'Unassigned';

        return {
          characterId: x.id,
          assignment
        };
      })
    });

    if (result.success) {
      router.push(`/character-tier?id=${result.id}`);
    } else {
      setMessage(result.error);
    }
  }

  console.log('Render Characters > ', props);
  // TODO
  // Display the tier name, if there is one.
  // Pre-populate the selected characters, if there is any.

  return (
    <div className="page page--column">
      <div className="search-container">
        <h1>Character Search</h1>

        <div className="flex flex--row flex--space-between">
          <p>
            Search for and select characters you would like to use in your
            tiered list.
          </p>
          {!props.isEdit ? (
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
          ) : (
            <Button
              className="search-container__button"
              btnStyle="primary"
              aria-label="Update tier selected characters"
              onClick={onSubmit}
            >
              Save
            </Button>
          )}
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

Characters.getInitialProps = async ({ query }: NextPageContext) => {
  const queryBase = process.env.API_URL_BASE;
  const { id = '' } = query;
  let error = '',
    tier = null,
    items = [];

  if (id) {
    const tResult = await fetchOnServer(`${queryBase}/ytw/tier/${id}`);

    if (tResult.success) {
      tier = tResult.tier;
      const ids = tier.characterState
        .map((x: CharacterAssignmentModel) => x.characterId)
        .join(',');

      const cResult = await fetchOnServer(
        `${queryBase}/api/charactersByIds?ids=${ids}`
      );

      items = cResult.items || [];
      error = cResult.error || '';
    } else {
      error = tResult.error;
    }
  }

  return { items, tier, error, isEdit: !!id };
};

export default Characters;
