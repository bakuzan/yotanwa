import { useState } from 'react';

import storage from '../utils/storage';

export function useStorage(key) {
  const setting = storage.get(key);
  const [value, setState] = useState(setting);

  function setWrappedState(newValue) {
    storage.set({ [key]: newValue });
    setState(newValue);
  }

  return [value, setWrappedState];
}
