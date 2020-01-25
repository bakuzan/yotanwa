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
