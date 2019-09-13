import { SearchTypes, Sources } from '../consts';

export default function processQuery(query: any) {
  const { source = Sources.MAL, type = SearchTypes.ANIME, username } = query;
  return { source, type, username };
}
