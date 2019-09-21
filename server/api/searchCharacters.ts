import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { AnilistCharactersResponse } from '../../interfaces/AnilistCharactersResponse';

const query = `
query($search: String!) {
  Page(page: 1, perPage: ${process.env.CHARACTER_SEARCH_LIMIT}) {
    characters(search: $search) {
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

  return (await response.json()) as AnilistCharactersResponse;
}

export default async function searchCharacters(req: Request, res: Response) {
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

    const list = data.Page.characters;
    respond({
      error: null,
      items: list.map((x) => ({
        id: x.id,
        image: x.image.medium,
        name: x.name.full
      })),
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
