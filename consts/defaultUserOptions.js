import defaultTiers from './defaultTiers';

export default {
  isDarkTheme: false,
  tierDistribution: Array.from([...new Map(defaultTiers).entries()]),
  hiddenScores: []
};
