import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useRef, useEffect, useState } from 'react';

import { useIntersect } from '../hooks/useIntersect';

const DEAD_IMAGE = 'https://i.imgur.com/gKr1YhF.png';

const Image = React.memo(function Image({ className, src, isLazy, ...props }) {
  const img = useRef();
  const isIntersecting = useIntersect(img, `${props.height * 1.5}px 0px`);
  const [imgSrc, setSource] = useState(isLazy ? null : src);

  useEffect(() => {
    const isNewSource = imgSrc !== src;
    if (!isLazy) {
      return;
    }

    if (isIntersecting && isNewSource) {
      // Set image source
      setSource(src);
    }
  }, [imgSrc, src, isIntersecting, isLazy]);

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
});

Image.displayName = 'Image';

Image.defaultProps = {
  isLazy: false
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  isLazy: PropTypes.bool
};

export default Image;
