import defaultTiers from './defaultTiers';

export interface YTWStorage {
  hiddenScores: string[];
  isDarkTheme: boolean;
  tierDistribution: [number, string][];
}

export default {
  hiddenScores: [],
  isDarkTheme: false,
  tierDistribution: Array.from([...new Map(defaultTiers).entries()])
} as YTWStorage;
