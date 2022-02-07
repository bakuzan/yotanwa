import React from 'react';
import { GetServerSideProps } from 'next';

import Grid from 'meiko/Grid';
import { YTWLink } from '@/components/YTWLink';
import ErrorInPage from '@/components/ErrorInPage';

import { TierModel } from '@/interfaces/TierModel';
import fetchOnServer from '@/utils/fetch';

const PAGE_URL_BASE = `/character-tiers`;

interface CharacterTierProps {
  error?: string;
  items: TierModel[];
  nextPage: number | null;
  prevPage: number | null;
  total: number;
}

function CharacterTiers({
  items = [],
  nextPage,
  prevPage,
  total,
  error
}: CharacterTierProps) {
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

export const getServerSideProps: GetServerSideProps<
  CharacterTierProps
> = async (context) => {
  const queryBase = process.env.API_URL_BASE;
  const { page = 1 } = context.query;

  const tiers = await fetchOnServer(`${queryBase}/ytw/tiers?page=${page}`);

  const items = tiers.items || [];
  const total = tiers.total || 0;
  const error = tiers.error || '';

  const nextPage = tiers.hasNextPage ? Number(page) + 1 : null;
  const prevPage = tiers.hasPrevPage ? Number(page) - 1 : null;

  return { props: { items, total, error, nextPage, prevPage } };
};

export default CharacterTiers;
