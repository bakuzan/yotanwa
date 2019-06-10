import './Loader.scss';
import React from 'react';

function Loader() {
  return (
    <div className="loader">
      <div className="loader__orb" />
      <div className="loader__orb" />
      <div className="loader__orb" />
    </div>
  );
}

Loader.displayName = 'Loader';

export default Loader;
