import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { AnilistCharactersResponse } from '../../interfaces/AnilistCharactersResponse';

const query = `
query($search: String!) {
  Page(page: 1, perPage: 15) {
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });

  return (await response.json()) as AnilistCharactersResponse;
}

export default async function searchCharacters(req: Request, res: Response) {
  const { term = '' } = req.query || {};
  const respond = (a: any) => res.status(200).json(a);

  if (!term) {
    return respond({ items: [], error: 'A search term is required.' });
  }

  try {
    const { data, errors } = await searchQuery(term);

    if (errors && errors.length) {
      const error = errors[0].message;
      return respond({ items: [], error, success: false });
    }

    const list = data.Page.characters;
    respond({
      items: list.map((x) => ({
        id: x.id,
        name: x.name.full,
        image: x.image.medium
      })),
      error: null,
      success: true
    });
  } catch (error) {
    console.error(error);
    respond({
      items: [],
      error: `Something went wrong and your request could not be completed.`,
      success: false
    });
  }
}
