import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import RadioToggle from './RadioToggle';

import { useStorage } from '../hooks/useStorage';
import Icons from '../consts/icons';

function Themer({ initialValue }: { initialValue: boolean }) {
  const [isClient, setIsClient] = useState(false);
  const [isDarkTheme, setTheme] = useStorage('isDarkTheme');

  const value = isClient ? isDarkTheme : initialValue;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    document.body.className = `theme theme--${value ? 'dark' : 'light'}`;
  }, [value]);

  return (
    <div className="themer">
      <RadioToggle
        label="Switch between Dark and Light mode"
        name="theme"
        icons={[Icons.moon, Icons.sun]}
        checked={value}
        onChange={setTheme}
      />
    </div>
  );
}

Themer.displayName = 'Themer';
Themer.propTypes = {
  initialValue: PropTypes.bool.isRequired
};

export default Themer;
