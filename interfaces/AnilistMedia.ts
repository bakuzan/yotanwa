export interface AnilistMedia {
  id: number;
  type: string;
  title: {
    romanji: string;
    english: string;
  };
  coverImage: {
    medium: string;
  };
}
