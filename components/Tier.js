import './Tier.scss';
import classNames from 'classnames';
import React from 'react';

import Grid from './Grid';
import { NewTabLink } from './YTWLink';
import Image from './Image';
import Tooltip from './Tooltip';

const width = 96;
const height = 125;

function Tier({ tier, items }) {
  const classModifier = (tier !== '-' ? tier : 'unranked').toLowerCase();

  return (
    <div className="tier">
      <div
        className={classNames('tier__text', [
          `tier__text--tier_${classModifier}`
        ])}
      >
        {tier}
      </div>
      <Grid className="tier__items" uniformRows items={items}>
        {(x) => (
          <Tooltip key={x.id} text={x.title}>
            <NewTabLink href={x.url}>
              <Image
                src={x.image}
                alt={x.title}
                width={width}
                height={height}
              />
            </NewTabLink>
          </Tooltip>
        )}
      </Grid>
    </div>
  );
}

export default Tier;
