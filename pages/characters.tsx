import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { Button } from 'meiko/Button';
import Grid from 'meiko/Grid';
import Tabs from 'meiko/Tabs';
import fetchFromServer from 'meiko/utils/fetch';

import { CharacterCard } from '@/components/CharacterCard';
import CharacterSearch from '@/components/CharacterSearchTabs/CharacterSearch';
import SeriesSearch from '@/components/CharacterSearchTabs/SeriesSearch';
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
    props.items
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
      characterState: selectedCharacters.map((x) => {
        const state = states.find((s) => s.characterId === x.id);
        const assignment = state?.assignment || 'Unassigned';

        return {
          assignment,
          characterId: x.id
        };
      }),
      id: tier.id,
      name: tier.name
    });

    if (result.success) {
      router.push(`/character-tier?id=${result.id}`);
    } else {
      setMessage(result.error);
    }
  }

  console.log('Render Characters > ', props);

  return (
    <div className="page page--column">
      <div className="search-container">
        <h1>Character Search</h1>

        <div className="flex flex--row flex--space-between">
          <p>
            {props.tier ? (
              <span>
                Search for and select characters you would like to use in{' '}
                <strong>{props.tier.name}</strong> tier.
              </span>
            ) : (
              `Search for and select characters you would like to use in your tiered list.`
            )}
          </p>
          <div>
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
            className={classNames(
              'card-grid',
              'card-grid',
              'card-grid--no-border',
              {
                'card-grid--no-items': selectedCharacters.length === 0
              }
            )}
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

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query
}) => {
  const queryBase = process.env.API_URL_BASE;

  const { id = '' } = query;
  let { ids = '' } = query;
  let error = '';
  let tier = null;
  let items = [];

  if (id) {
    const tierResult = await fetchOnServer(`${queryBase}/ytw/tier/${id}`);

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

  return { props: { items, tier, error, isEdit: !!id } };
};

export default Characters;
