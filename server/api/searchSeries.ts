import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { AnilistMedia } from '../../interfaces/AnilistMedia';
import { AnilistResponse } from '../../interfaces/AnilistResponse';

const query = `
query($search: String!) {
  Page(page: 1, perPage: ${process.env.CHARACTER_SEARCH_LIMIT}) {
    media(search: $search) {
      id
      type
      title {
        romanji
        english
      }
      coverImage {
        medium
      }
    }
  }
}
`;

async function searchQuery(search: string) {
  const body = JSON.stringify({
    query,
    variables: { search }
  });

  const response = await fetch('https://graphql.anilist.co', {
    body,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  return (await response.json()) as AnilistResponse<AnilistMedia>;
}

export default async function searchSeries(req: Request, res: Response) {
  const { term = '' } = req.query || {};
  const respond = (a: any) => res.status(200).json(a);

  if (!term) {
    return respond({ error: 'A search term is required.', items: [] });
  }

  try {
    const { data, errors } = await searchQuery(term);

    if (errors && errors.length) {
      const error = errors[0].message;
      return respond({ error, items: [], success: false });
    }

    respond({
      error: null,
      items: data.Page.media,
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
