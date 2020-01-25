import classNames from 'classnames';
import React from 'react';

import { Button } from 'meiko/Button';
import Image from 'meiko/Image';
import Tooltip from 'meiko/Tooltip';

import { width, height } from '../consts/imageSize';
import { AnilistMedia } from '../interfaces/AnilistMedia';

import './MediaCard.scss';

interface MediaCardProps {
  className?: string;
  label?: string;
  data: AnilistMedia;
  listItem?: boolean;
  showName?: boolean;
  onClick: (item: AnilistMedia) => void;
}

export default function MediaCard(props: MediaCardProps) {
  const {
    data: x,
    label,
    listItem = false,
    showName = false,
    onClick,
    ...pass
  } = props;
  const Container = listItem ? 'li' : 'div';
  const mediaName = `${x.title.romaji}\n(${x.title.english})`;

  return (
    <Container {...pass} className={classNames('media', pass.className)}>
      <Tooltip text={mediaName} center highlight>
        <Button
          className={classNames('media__button', {
            'media__button--show-name': showName
          })}
          aria-label={label}
          onClick={() => onClick(x)}
        >
          <Image
            src={x.coverImage.medium}
            alt={mediaName}
            width={width}
            height={height}
          />
          {showName && <div className="media__name"> {mediaName} </div>}
        </Button>
      </Tooltip>
    </Container>
  );
}
