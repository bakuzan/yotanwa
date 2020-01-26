import { YTWCharacter } from '@/interfaces/YTWCharacter';

export interface SearchProps {
  selectedCharacters: YTWCharacter[];
  onUpdate: (list: YTWCharacter[]) => void;
}

export interface SearchState {
  results: YTWCharacter[];
  searchString: string;
}

export enum SearchTabAction {
  UpdateSearchString,
  LoadResults,
  LoadSeriesResults,
  LoadSeries,
  NextPage
}

export type SearchAction =
  | {
      type: SearchTabAction.UpdateSearchString;
      value: string;
    }
  | {
      type: SearchTabAction.LoadResults;
      items: YTWCharacter[];
      page?: number;
    };
