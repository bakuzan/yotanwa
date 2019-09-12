import './CharacterCard.scss';

import React from 'react';

import Button from '../components/Button';
import Image from '../components/Image';
import Tooltip from '../components/Tooltip';

import { width, height } from '../consts/imageSize';

function CharacterCard({ label, data, onClick }) {
  return (
    <li className="character">
      <Tooltip text={data.name} center highlight>
        <Button
          className="character__button"
          aria-label={label}
          onClick={() => onClick(data)}
        >
          <Image
            src={data.image}
            alt={data.name}
            width={width}
            height={height}
          />
        </Button>
      </Tooltip>
    </li>
  );
}

CharacterCard.displayName = 'CharacterCard';

export default CharacterCard;
