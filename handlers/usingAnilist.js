const fetch = require('node-fetch');

const createHandler = require('./createHandler');
const generateUniqueId = require('../utils/generateUniqueId');

const query = `
  query($user: String, $type: MediaType) {
    collection: MediaListCollection(userName: $user, type: $type, status: COMPLETED) {
      lists {
        entries {
          mediaId
          score(format: POINT_10_DECIMAL)
          media {
            coverImage {
              medium
            }
            title {
              userPreferred
            }
          }
        }
      }
    }
  }
`;

function mapItem(type) {
  return (item) => ({
    id: generateUniqueId(),
    title: item.media.title.userPreferred,
    image: item.media.coverImage.medium,
    url: `https://anilist.co/${type}/${item.mediaId}`,
    score: item.score
  });
}

async function fetchList(user, type) {
  const body = JSON.stringify({
    query,
    variables: { user, type: type.toUpperCase() }
  });

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });

  return response.json();
}

module.exports = createHandler(async function handler(user, type) {
  console.log(`search/anilist > ${type}, ${user}`);
  const { data, errors } = await fetchList(user, type);

  if (errors && errors.length) {
    const error = errors[0].message;
    return { items: [], error };
  }

  const list = data.collection.lists[0].entries;
  return { items: list.map(mapItem(type)), error: null };
});
