import { useState } from 'react';

import storage from '../utils/storage';

export function useStorage(key: string) {
  const setting = storage.get(key);
  const [value, setState] = useState(setting);

  function setWrappedState(newValue: any) {
    storage.set({ [key]: newValue });
    setState(newValue);
  }

  return [value, setWrappedState];
}
