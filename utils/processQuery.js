import { sources, types } from '../consts';

export default function processQuery(query) {
  const { source = sources.MAL, type = types.ANIME, username } = query;
  return { source, type, username };
}
