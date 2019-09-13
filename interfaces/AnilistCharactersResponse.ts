export interface AnilistCharacter {
  id: number;
  name: {
    full: string;
  };
  image: {
    medium: string;
  };
}

interface GQLError {
  message: string;
}

export interface AnilistCharactersResponse {
  data: {
    Page: {
      characters: AnilistCharacter[];
    };
  };
  errors?: GQLError[];
}
