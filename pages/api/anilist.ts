import fetch from '../../utils/node-fetch';

import { AnilistMediaListItem } from '@/interfaces/AnilistMedia';
import { AnilistCollectionResponse } from '@/interfaces/AnilistResponse';
import createHandler from '../../utils/createHandler';
import generateUniqueId from '../../utils/generateUniqueId';

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

function mapItem(type: string) {
  return (item: AnilistMediaListItem) => ({
    id: generateUniqueId(),
    image: item.media.coverImage.medium,
    score: item.score,
    title: item.media.title.userPreferred,
    url: `https://anilist.co/${type}/${item.mediaId}`
  });
}

async function fetchList(user: string, type: string) {
  const body = JSON.stringify({
    query,
    variables: { user, type: type.toUpperCase() }
  });

  const response = await fetch('https://graphql.anilist.co', {
    body,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  return (await response.json()) as AnilistCollectionResponse<AnilistMediaListItem>;
}

export default createHandler(async function handler(
  user: string,
  type: string
) {
  const { data, errors } = await fetchList(user, type);

  if (errors && errors.length) {
    const error = errors[0].message;
    return { items: [], error };
  }

  const list = data.collection.lists[0].entries;
  return { items: list.map(mapItem(type)), error: null };
});
