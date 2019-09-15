import classNames from 'classnames';
import React from 'react';

import Image from 'meiko/Image';

type ImageProps = HTMLImageElement & {
  isLazy?: boolean;
};

const YTWImage = React.memo<ImageProps>(function YTWImage({
  className,
  ...props
}) {
  const margin = props.height ? `${props.height * 1.5}px 0px` : undefined;

  return (
    <Image
      {...props}
      className={classNames('image', className)}
      intersectionMargin={margin}
    />
  );
});

YTWImage.displayName = 'Image';

export default YTWImage;
