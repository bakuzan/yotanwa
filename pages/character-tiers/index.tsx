import { GetServerSideProps } from 'next';

import fetchOnServer from '@/utils/fetch';
import { CharacterTierProps } from './[page]';

export { default } from './[page]';

export const getServerSideProps: GetServerSideProps<
  CharacterTierProps
> = async (context) => {
  const queryBase = process.env.API_URL_BASE;
  const { page = 1 } = context.query;

  const tiers = await fetchOnServer(`${queryBase}/ytw/tiers?page=${page}`);
  console.log('getServerSide:', tiers);
  if (!tiers) {
    return {
      props: {
        items: [],
        total: 0,
        error: `Failed to fetch tiers page ${page}.`,
        nextPage: null,
        prevPage: null
      }
    };
  }

  const items = tiers.items || [];
  const total = tiers.total || 0;
  const error = tiers.error || '';

  const nextPage = tiers.hasNextPage ? Number(page) + 1 : null;
  const prevPage = tiers.hasPrevPage ? Number(page) - 1 : null;

  return { props: { items, total, error, nextPage, prevPage } };
};
