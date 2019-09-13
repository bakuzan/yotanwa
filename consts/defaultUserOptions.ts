import defaultTiers from './defaultTiers';

export default {
  hiddenScores: [],
  isDarkTheme: false,
  tierDistribution: Array.from([...new Map(defaultTiers).entries()])
};
