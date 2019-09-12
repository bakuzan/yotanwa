import '../styles/characters.scss';
import fetch from 'node-fetch';
import React from 'react';

import Grid from '@/components/Grid';
import CharacterCard from '@/components/CharacterCard';
import { YTWLink } from '@/components/YTWLink';

function CharacterTier({ items, error }) {
  if (error) {
    // TODO handler error
    return (
      <div className="page page--column">
        <div>{error}</div>
        <div>
          <YTWLink href="/characters">Return to character selection</YTWLink>
        </div>
      </div>
    );
  }

  const characterPool = items;
  console.log('RENDER TIER', items, error);
  return (
    <div className="page page--column">
      <div>tier section</div>
      <div>
        {' '}
        <Grid className="characters" uniformRows items={characterPool}>
          {(x) => <CharacterCard key={x.id} data={x} />}
        </Grid>
      </div>
    </div>
  );
}

CharacterTier.getInitialProps = async ({ req }) => {
  const { ids = '' } = req.query;

  const response = await fetch(
    `http://localhost:7200/api/charactersByIds?ids=${ids}`
  );
  const result = await response.json();

  return { items: result.items, error: result.error };
};

export default CharacterTier;
