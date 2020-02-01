import scraper from 'mal-scraper';

import { MAX_RESPONSE_COUNT } from '../../consts';
import createHandler from '../../utils/createHandler';
import generateUniqueId from '../../utils/generateUniqueId';

const g = (s: string) => (s ? s : '');

function mapItem(type: string) {
  return (item: any) => ({
    id: generateUniqueId(),
    image: g(item[`${type}ImagePath`])
      .replace('/r/96x136', '')
      .replace(/\?.*$/, ''),
    score: item.score,
    title: item[`${type}Title`],

    url: `https://myanimelist.net${item[`${type}Url`]}`
  });
}

async function fetchWatchList(user: string, type: string) {
  const results = [];
  let offset = 0;

  while (true) {
    const response = await scraper.getWatchListFromUser(user, offset, type);
    results.push(...response);

    if (response.length < MAX_RESPONSE_COUNT) {
      return results;
    }

    offset = results.length;
  }
}

export default createHandler(async function handler(user, type) {
  const list = await fetchWatchList(user, type);
  return { items: list.map(mapItem(type)), error: null };
});
