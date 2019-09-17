import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { AnilistCharactersResponse } from '../../interfaces/AnilistCharactersResponse';

/* tslint:disable:object-literal-sort-keys */
// const TEMP_DATA = [
//   {
//     id: 40592,
//     name: 'Meiko Honma',
//     image:
//       'https://s4.anilist.co/file/anilistcdn/character/medium/b40592-UxJe0T0HyczW.jpg'
//   },
//   {
//     id: 80437,
//     name: 'Meiko',
//     image: 'https://s4.anilist.co/file/anilistcdn/character/medium/80437.jpg'
//   },
//   {
//     id: 44214,
//     name: 'Meiko',
//     image: 'https://s4.anilist.co/file/anilistcdn/character/medium/44214.jpg'
//   },
//   {
//     id: 14076,
//     name: 'Meiko',
//     image:
//       'https://s4.anilist.co/file/anilistcdn/character/medium/n14076-8v6IggCSPTmw.jpg'
//   },
//   {
//     id: 27122,
//     name: 'Meiko',
//     image: 'https://s4.anilist.co/file/anilistcdn/character/medium/27122.jpg'
//   },
//   {
//     id: 29496,
//     name: 'Meiko Himuro',
//     image: 'https://s4.anilist.co/file/anilistcdn/character/medium/29496.jpg'
//   },
//   {
//     id: 36166,
//     name: 'Meiko Urushima',
//     image: 'https://s4.anilist.co/file/anilistcdn/character/medium/36166.jpg'
//   },
//   {
//     id: 55703,
//     name: 'Meiko Hirameki',
//     image: 'https://s4.anilist.co/file/anilistcdn/character/medium/55703.jpg'
//   },
//   {
//     id: 18350,
//     name: 'Meiko Inoue',
//     image: 'https://s4.anilist.co/file/anilistcdn/character/medium/18350.jpg'
//   },
//   {
//     id: 32802,
//     name: 'Meiko Kajiwara',
//     image: 'https://s4.anilist.co/file/anilistcdn/character/medium/32802.jpg'
//   }
// ];

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
  // TODO - restore actual call
  // console.log('Fake search with ', search);
  // return {
  //   data: {
  //     Page: {
  //       characters: TEMP_DATA.map((x) => ({
  //         id: x.id,
  //         name: { full: x.name },
  //         image: { medium: x.image }
  //       }))
  //     }
  //   }
  // } as AnilistCharactersResponse;
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
