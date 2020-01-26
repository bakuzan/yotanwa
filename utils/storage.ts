import defaultUserOptions, { YTWStorage } from '../consts/defaultUserOptions';

import cookies from './cookies';
import isClient from './isClient';

export default {
  DEFAULTS: {
    ...defaultUserOptions
  },
  get(key: keyof YTWStorage) {
    if (!isClient()) {
      return;
    }

    if (cookies.hasItem(key)) {
      const item = cookies.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    }

    return this.DEFAULTS[key];
  },
  set(newValues: { [key: string]: any }) {
    Object.keys(newValues).forEach((key) => {
      cookies.setItem(key, newValues[key], Infinity);
    });
  }
};
