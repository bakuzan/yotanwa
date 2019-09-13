import { AnilistCharactersResponse } from '@/interfaces/AnilistCharactersResponse';
import { Request, Response } from 'express';
// import fetch from 'node-fetch';

/* tslint:disable:object-literal-sort-keys */
const TEMP_DATA = [
  {
    id: 14076,
    name: 'Meiko',
    image:
      'https://s4.anilist.co/file/anilistcdn/character/medium/n14076-8v6IggCSPTmw.jpg'
  },
  {
    id: 40592,
    name: 'Meiko Honma',
    image:
      'https://s4.anilist.co/file/anilistcdn/character/medium/b40592-UxJe0T0HyczW.jpg'
  }
];

const query = `
query($ids: [Int]) {
    Page {
      characters(id_in: $ids) {
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
async function search(ids: number[]) {
  // const body = JSON.stringify({
  //   query,
  //   variables: { ids }
  // });
  // TODO - restore actual call
  console.log('Fake search with ', ids);
  return {
    data: {
      Page: {
        characters: TEMP_DATA.map((x) => ({
          id: x.id,
          name: { full: x.name },
          image: { medium: x.image }
        }))
      }
    }
  } as AnilistCharactersResponse;
  // const response = await fetch('https://graphql.anilist.co', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body
  // });

  // return (await response.json()) as AnilistCharactersResponse;
}

export default async function searchCharactersById(
  req: Request,
  res: Response
) {
  const { ids = '' } = req.query || {};
  const respond = (a: any) => res.status(200).json(a);

  const characterIds = ids.split(',').map((x: string) => Number(x));

  if (!characterIds.length) {
    respond({ items: [], error: 'No characters provided.' });
  } else if (characterIds.some((x) => isNaN(x))) {
    respond({ items: [], error: `Some character id's were invalid.` });
  }

  try {
    const { data, errors } = await search(characterIds);

    if (errors && errors.length) {
      const error = errors[0].message;
      respond({ items: [], error });
    }

    const list = data.Page.characters;
    respond({
      items: list.map((x) => ({
        id: x.id,
        name: x.name.full,
        image: x.image.medium
      })),
      error: null
    });
  } catch (error) {
    console.error(error);
    respond({
      items: [],
      error: `Something went wrong and your request could not be completed.`
    });
  }
}