import React, { useEffect, useState } from 'react';

import Grid from '../components/Grid';
import Image from '../components/Image';

import { useDebounce } from '../hooks/useDebounce';
import { usePrevious } from '../hooks/usePrevious';
import { width, height } from '../consts/imageSize';

export default function Characters() {
  const [searchString, setSearchString] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearchTerm = useDebounce(searchString, 500);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  useEffect(() => {
    async function searchForCharacter(term) {
      try {
        const response = await fetch(`/api/characters?term=${term}`);
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

  return (
    <div className="page page--column">
      <div className="search-container">
        <h1>Tier List Character Search</h1>
        <p>
          Search for and select characters you would like to use in your tiered
          list.
        </p>

        <Input
          id="search"
          name="search"
          label="search"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </div>
      <div className="search-results">
        <Grid className="characters" uniformRows items={searchResults}>
          {(x) => (
            <li key={x.id} className="character">
              <Image src={x.image} alt={x.name} width={width} height={height} />
              <div className="character__name">{x.name}</div>
            </li>
          )}
        </Grid>
      </div>
    </div>
  );
}
