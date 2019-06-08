import { types, sources } from './index';

export const sourceOptions = [
  { defaultChecked: true, value: sources.MAL, label: 'MAL' },
  { value: sources.ANILIST, label: 'Anilist' }
];

export const typeOptions = [
  { defaultChecked: true, value: types.ANIME, label: 'Anime' },
  { value: types.MANGA, label: 'Manga' }
];
