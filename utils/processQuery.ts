import { SearchTypes, Sources } from '../consts';

interface SearchArgs {
  source: Sources;
  type: string;
  username: string;
}

export default function processQuery(query: any): SearchArgs {
  const { source = Sources.MAL, type = SearchTypes.ANIME, username } = query;
  return { source, type, username };
}
