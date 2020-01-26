import { YTWCharacter } from '@/interfaces/YTWCharacter';

export interface SearchProps {
  selectedCharacters: YTWCharacter[];
  onUpdate: (list: YTWCharacter[]) => void;
}

export interface SearchState {
  results: YTWCharacter[];
  searchString: string;
}

// TODO
// If you can extend an enum, this could be split into 2 parts...
export enum SearchTabAction {
  UpdateSearchString,
  LoadResults,
  LoadSeriesResults,
  LoadSeries,
  NextPage,
  ToggleLoading
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
      pageSize?: number;
    };
