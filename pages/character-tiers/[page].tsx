import React from 'react';

import Grid from 'meiko/Grid';
import { YTWLink } from '@/components/YTWLink';
import ErrorInPage from '@/components/ErrorInPage';

import { TierModel } from '@/interfaces/TierModel';
import createLogger from '@/utils/logger';

const debug = createLogger('CharacterTiers');
const PAGE_URL_BASE = `/character-tiers`;

export interface CharacterTierProps {
  error?: string;
  items: TierModel[];
  nextPage: number | null;
  prevPage: number | null;
  total: number;
}

export default function CharacterTiers({
  items = [],
  nextPage,
  prevPage,
  total = 0,
  error
}: CharacterTierProps) {
  debug({ error, items, nextPage, prevPage, total });

  if (error) {
    return <ErrorInPage error={error} />;
  }

  return (
    <section className="page page--column tiers-list">
      <header className="tiers-list__header">
        <h1 className="tiers-list__title">Character Tiers</h1>
      </header>
      <div className="tiers-list__content">
        <div className="count">
          Showing {items.length} of {total}
        </div>
        <Grid className="tiers-list__grid" uniformRows items={items}>
          {(data: TierModel) => {
            return (
              <li key={data.id} className="tiers-list__item">
                <YTWLink href={`/character-tier?id=${data.id}`}>
                  {data.name}
                </YTWLink>
              </li>
            );
          }}
        </Grid>
      </div>
      <nav className="paging">
        {prevPage && (
          <YTWLink
            className="paging__link"
            href={`${PAGE_URL_BASE}/[page]`}
            as={`${PAGE_URL_BASE}/${prevPage}`}
          >
            Prev
          </YTWLink>
        )}
        {prevPage && nextPage && '|'}
        {nextPage && (
          <YTWLink
            className="paging__link"
            href={`${PAGE_URL_BASE}/[page]`}
            as={`${PAGE_URL_BASE}/${nextPage}`}
          >
            Next
          </YTWLink>
        )}
      </nav>
    </section>
  );
}
