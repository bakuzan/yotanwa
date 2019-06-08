import { useState } from 'react';

import storage from '../utils/storage';

export function useStorage(key) {
  const setting = storage.get()[key];
  const [value, setState] = useState(setting);

  function setWrappedState(newValue) {
    const isObject = typeof newValue === 'object';
    const currentSetting = storage.get()[key];

    const data = isObject
      ? { [key]: { ...currentSetting, ...newValue } }
      : { [key]: newValue };

    const updated = storage.set(data)[key];
    setState(updated);
  }

  return [value, setWrappedState];
}
