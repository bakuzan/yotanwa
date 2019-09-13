import defaultUserOptions from '../consts/defaultUserOptions';

import cookies from './cookies';
import isClient from './isClient';

export default {
  DEFAULTS: {
    ...defaultUserOptions
  },
  get(key: string) {
    if (!isClient()) {
      return;
    }

    return cookies.hasItem(key)
      ? JSON.parse(cookies.getItem(key))
      : this.DEFAULTS[key];
  },
  set(newValues: { [key: string]: any }) {
    Object.keys(newValues).forEach((key) => {
      cookies.setItem(key, newValues[key], Infinity);
    });
  }
};
