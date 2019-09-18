import { NextApiRequest, NextApiResponse } from 'next';
import {
  AnilistCharacter,
  AnilistCharactersResponse
} from '../../interfaces/AnilistCharactersResponse';
import fetchOnServer from '../../utils/fetch';

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
  const body = JSON.stringify({
    query,
    variables: { ids }
  });

  const response = await fetchOnServer(
    'https://graphql.anilist.co',
    'POST',
    body
  );

  return response as AnilistCharactersResponse;
}

export default async function searchCharactersById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ids = '' } = req.query || {};
  const respond = (a: any) => res.status(200).json(a);

  const idString = ids as string;
  const characterIds = idString.split(',').map((x: string) => Number(x));

  if (!characterIds.length) {
    respond({ items: [], error: 'No characters provided.' });
  } else if (characterIds.some((x: any) => isNaN(x))) {
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
      items: list.map((x: AnilistCharacter) => ({
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
