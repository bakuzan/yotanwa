import defaultUserOptions from '../consts/defaultUserOptions';

import isClient from './isClient';
import cookies from './cookies';

export default {
  DEFAULTS: {
    ...defaultUserOptions
  },
  get(key) {
    if (!isClient()) {
      return;
    }

    return cookies.hasItem(key)
      ? JSON.parse(cookies.getItem(key))
      : this.DEFAULTS[key];
  },
  set(newValues) {
    Object.keys(newValues).forEach((key) => {
      cookies.setItem(key, newValues[key]);
    });
  }
};
