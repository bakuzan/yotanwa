const scraper = require('mal-scraper');

const createHandler = require('./createHandler');
const { MAX_RESPONSE_COUNT } = require('../consts');
const generateUniqueId = require('../utils/generateUniqueId');

const g = (s) => (s ? s : '');

function mapItem(type) {
  return (item) => ({
    id: generateUniqueId(),
    title: item[`${type}Title`],
    image: g(item[`${type}ImagePath`])
      .replace('/r/96x136', '')
      .replace(/\?.*$/, ''),
    url: `https://myanimelist.net${item[`${type}Url`]}`,
    score: item.score
  });
}

async function fetchWatchList(user, type) {
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

module.exports = createHandler(async function handler(user, type) {
  console.log(`search/mal > ${type}, ${user}`);
  const list = await fetchWatchList(user, type);
  return { items: list.map(mapItem(type)), error: null };
});
