import { SearchTypes, Sources } from '../consts';

interface SearchArgs {
  source: Sources;
  type: string;
  username: string;
  [key: string]: string;
}

export default function processQuery(query: any): SearchArgs {
  const {
    source = Sources.MAL,
    type = SearchTypes.ANIME,
    username,
    ...other
  } = query;

  return { source, type, username, ...other };
}
