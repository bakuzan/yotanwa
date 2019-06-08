import React, { useState, useEffect } from 'react';

import RadioToggle from './RadioToggle';

import { useStorage } from '../hooks/useStorage';
import Icons from '../consts/icons';

function Themer() {
  const [isClient, setIsClient] = useState(false);
  const [isDarkTheme, setTheme] = useStorage('isDarkTheme');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    document.body.className = `theme theme--${isDarkTheme ? 'dark' : 'light'}`;
  }, [isDarkTheme]);

  if (isClient) {
    return (
      <RadioToggle
        label="Switch between Dark and Light mode"
        name="theme"
        icons={[Icons.moon, Icons.sun]}
        checked={isDarkTheme}
        onChange={setTheme}
      />
    );
  }

  return null;
}

export default Themer;
