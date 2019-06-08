import defaultTiers from '../consts/defaultTiers';
import isClient from './isClient';

const STORE_KEY = 'ytwSettings';

export default {
  DEFAULTS: {
    isDarkTheme: false,
    tierDistribution: Array.from([...new Map(defaultTiers).entries()]),
    hiddenScores: []
  },
  get(key) {
    if (!isClient()) {
      return { ...this.DEFAULTS };
    }

    const values = JSON.parse(localStorage.getItem(STORE_KEY)) || this.DEFAULTS;
    const data = { ...this.DEFAULTS, ...values };
    return key ? data[key] : data;
  },
  set(newValues) {
    const values = this.get();
    const updated = { ...values, ...newValues };
    localStorage.setItem(STORE_KEY, JSON.stringify(updated));
    return updated;
  }
};
