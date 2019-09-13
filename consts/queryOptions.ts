import { SearchTypes, Sources } from './index';

export const sourceOptions = [
  { defaultChecked: true, value: Sources.MAL, label: 'MAL' },
  { value: Sources.ANILIST, label: 'Anilist' }
];

export const typeOptions = [
  { defaultChecked: true, value: SearchTypes.ANIME, label: 'Anime' },
  { value: SearchTypes.MANGA, label: 'Manga' }
];
