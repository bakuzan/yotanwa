import { AnilistCharacter } from './AnilistCharacter';

export interface AnilistMediaCharacters {
  id: number;
  characters: {
    nodes: AnilistCharacter[];
  };
}
