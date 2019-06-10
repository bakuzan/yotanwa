import './Tier.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import Grid from './Grid';
import { NewTabLink } from './YTWLink';
import Image from './Image';
import Tooltip from './Tooltip';

const width = 96;
const height = 125;

function Tier({ tier, scores, items }) {
  const classModifier = (tier !== '-' ? tier : 'unranked').toLowerCase();
  const scoreStr = scores.join('\n\r');

  return (
    <div className="tier">
      <Tooltip
        delay={1000}
        usePosition
        allowWrapping
        text={`Tier includes entries with the following scores:\n\r${scoreStr}`}
        className={classNames('tier__text', [
          `tier__text--tier_${classModifier}`
        ])}
      >
        {tier}
      </Tooltip>
      <Grid className="tier__items" uniformRows items={items}>
        {(x) => (
          <li key={x.id}>
            <Tooltip text={x.title}>
              <NewTabLink href={x.url}>
                <Image
                  src={x.image}
                  alt={x.title}
                  width={width}
                  height={height}
                />
              </NewTabLink>
            </Tooltip>
          </li>
        )}
      </Grid>
    </div>
  );
}

Tier.displayName = 'Tier';
Tier.propTypes = {
  tier: PropTypes.string.isRequired,
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      image: PropTypes.string,
      url: PropTypes.string,
      score: PropTypes.number
    })
  ).isRequired
};

export default Tier;
