import { AnilistMediaCharacters } from '@/interfaces/AnilistMediaCharacters';
import { AnilistResponse } from '@/interfaces/AnilistResponse';
import { SearchResponse } from '@/interfaces/ApiResponse';
import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

const pageSize = Number(process.env.CHARACTER_SEARCH_LIMIT) || 0;

const query = `
query ($id: Int, $page: Int) {
  Media(id: $id) {
    id
    characters(sort: FAVOURITES_DESC, page: $page, perPage: ${pageSize}) {
      nodes {
        id
        name {
          full
        }
        image {
          medium
        }
      }
    }
  }
}
`;

async function fetchQuery(id: number, page: number) {
  const body = JSON.stringify({
    query,
    variables: { id, page }
  });

  const response = await fetch('https://graphql.anilist.co', {
    body,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  return (await response.json()) as AnilistResponse<AnilistMediaCharacters>;
}

export default async function fetchSeriesCharacters(
  req: Request,
  res: Response
) {
  const { id = 0 } = req.params || {};
  const { page = 1 } = req.query || {};
  const seriesId = Number(id);
  const pageNum = Number(page);
  const respond = (a: SearchResponse<YTWCharacter>) => res.status(200).json(a);

  if (!id) {
    return respond({
      error: 'A series id is required.',
      items: [],
      success: false
    });
  } else if (isNaN(seriesId)) {
    return respond({
      error: 'Series id is invalid.',
      items: [],
      success: false
    });
  }

  try {
    const { data, errors } = await fetchQuery(seriesId, pageNum || 1);

    if (errors && errors.length) {
      const error = errors[0].message;
      return respond({ error, items: [], success: false });
    }

    respond({
      items: data.Media.characters.nodes.map((x) => ({
        id: x.id,
        image: x.image.medium,
        name: x.name.full
      })),
      pageSize,
      success: true
    });
  } catch (error) {
    console.error(error);
    respond({
      error: `Something went wrong and your request could not be completed.`,
      items: [],
      success: false
    });
  }
}
