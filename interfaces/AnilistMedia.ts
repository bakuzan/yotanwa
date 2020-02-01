export interface AnilistMedia {
  id: number;
  type: string;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    medium: string;
  };
}

export interface AnilistMediaListItem {
  mediaId: number;
  score: number;
  media: {
    coverImage: {
      medium: string;
    };
    title: {
      userPreferred: string;
    };
  };
}
