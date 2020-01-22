import { NextApiRequest, NextApiResponse } from 'next';
import { AnilistCharacter } from '../../interfaces/AnilistCharacter';
import { AnilistResponse } from '../../interfaces/AnilistResponse';
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

  return response as AnilistResponse<AnilistCharacter>;
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
    respond({ error: 'No characters provided.', items: [] });
  } else if (characterIds.some((x: any) => isNaN(x))) {
    respond({ error: `Some character id's were invalid.`, items: [] });
  }

  try {
    const { data, errors } = await search(characterIds);

    if (errors && errors.length) {
      const error = errors[0].message;
      respond({ error, items: [] });
    }

    const list = data.Page.characters;
    respond({
      error: null,
      items: list.map((x: AnilistCharacter) => ({
        id: x.id,
        image: x.image.medium,
        name: x.name.full
      }))
    });
  } catch (error) {
    console.error(error);
    respond({
      error: `Something went wrong and your request could not be completed.`,
      items: []
    });
  }
}
