import { useState } from 'react';

import { YTWStorage } from '@/consts/defaultUserOptions';
import storage from '../utils/storage';

export function useStorage(key: keyof YTWStorage) {
  const setting = storage.get(key);
  const [value, setState] = useState(setting);

  function setWrappedState(newValue: any) {
    storage.set({ [key]: newValue });
    setState(newValue);
  }

  return [value, setWrappedState];
}
