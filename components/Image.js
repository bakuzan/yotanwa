import classNames from 'classnames';
import React, { useRef, useEffect, useState } from 'react';

import { useIntersect } from '../hooks/useIntersect';

const DEAD_IMAGE = 'https://i.imgur.com/gKr1YhF.png';

function Image({ className, src, ...props }) {
  const img = useRef();
  const isIntersecting = useIntersect(img, `${props.height * 1.5}px 0px`);
  const [imgSrc, setSource] = useState(null);

  useEffect(() => {
    const isNewSource = imgSrc !== src;

    if (isIntersecting && isNewSource) {
      // Set image source
      setSource(src);
    }
  }, [imgSrc, src, isIntersecting]);

  return (
    <img
      ref={img}
      className={classNames('image', className)}
      src={imgSrc}
      alt=""
      {...props}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = DEAD_IMAGE;
      }}
    />
  );
}

export default Image;
