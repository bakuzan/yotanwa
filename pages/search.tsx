import '../styles/search.scss';
import React from 'react';

import { Button } from 'meiko/Button';
import SelectBox from 'meiko/SelectBox';
import Tickbox from 'meiko/Tickbox';
import Tooltip from 'meiko/Tooltip';

import { YTWSeries } from '../interfaces/YTWSeries';
import Image from '../components/Image';
import Tier from '../components/Tier';
import { NewTabLink, YTWLink } from '../components/YTWLink';

import { Sources, Ranks } from '../consts';
import { width, height } from '../consts/imageSize';
import defaultTiers from '../consts/defaultTiers';
import getUserLinks from '../utils/getUserLinks';
import generateTiers from '../utils/generateTiers';
import storage from '../utils/storage';
import processQuery from '../utils/processQuery';
import fetchOnServer from '../utils/fetch';

type SearchProps = {
  cookies: any;
  username: string;
  source: string;
  type: string;
  error: string;
  items: YTWSeries[];
  links: {
    list: string;
    profile: string;
  };
};

type SearchState = {
  showSettings: boolean;
  tierDistribution: Map<number, string>;
  hiddenScores: Set<number>;
};

async function fetchListItems(
  source = Sources.MAL,
  username: string,
  type: string
) {
  return await fetchOnServer(
    `${process.env.API_URL_BASE}/api/${source}?username=${username}&type=${type}`
  );
}

export default class extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);

    const { cookies } = props;
    this.state = {
      showSettings: false,
      tierDistribution: new Map(cookies.tierDistribution),
      hiddenScores: new Set(cookies.hiddenScores)
    };

    this.handleCustomTierChange = this.handleCustomTierChange.bind(this);
    this.handlePersistCustomTierChange = this.handlePersistCustomTierChange.bind(
      this
    );
  }

  static async getInitialProps({ query }) {
    const { source, type, username } = processQuery(query);

    const { items, error } = await fetchListItems(source, username, type);
    const links = getUserLinks(source, username, type);

    return { items, error, username, source, type, links };
  }

  handleCustomTierChange(event: Event) {
    const { name, value } = event.target as HTMLSelectElement;
    this.setState((p) => ({
      tierDistribution: p.tierDistribution.set(Number(name), value)
    }));
  }

  handlePersistCustomTierChange() {
    const hiddenScores = Array.from(this.state.hiddenScores).join(',');
    const tierDistribution = Array.from(this.state.tierDistribution.entries())
      .map((x) => x.join('|'))
      .join(',');

    storage.set({ tierDistribution, hiddenScores });

    this.setState({ showSettings: false });
  }

  toggleHiddenScore(score: number) {
    this.setState((p) => {
      let hiddenScores = p.hiddenScores;

      if (!hiddenScores.delete(score)) {
        hiddenScores = hiddenScores.add(score);
      }

      return { hiddenScores };
    });
  }

  render() {
    const { showSettings, tierDistribution, hiddenScores } = this.state;
    const { items = [], error, username, source, type, links } = this.props;

    const hasError = !!error;
    const hasItems = items.length > 0;

    const tierValues = Array.from(tierDistribution.entries());
    const tiers = generateTiers(items, tierDistribution, hiddenScores);

    return (
      <section className="page page--column tier-page">
        <header className="tier-page__header">
          <div className="flex flex--column flex--all">
            <h1 className="tier-page__title">{`${username}'s tier list`}</h1>

            <p className="tier-page__subtitle">
              Source: <NewTabLink href={links.profile}>{source}</NewTabLink>
            </p>
            <p className="tier-page__subtitle">
              Type: <NewTabLink href={links.list}>{type}</NewTabLink>
            </p>
          </div>
        </header>
        <div className="tier-page__options">
          <YTWLink href="/">Back to user search</YTWLink>
          <Button
            btnStyle="primary"
            disabled={showSettings}
            onClick={() => this.setState({ showSettings: true })}
          >
            Customise
          </Button>
        </div>
        <div className="flex flex--column tier-page__content">
          {hasError && (
            <div className="tier-page__error">
              <div className="tier-page__error-inner">
                <div className="icon icon--error" />
                An Error Occurred.
              </div>
              {error}
            </div>
          )}
          {showSettings && (
            <div className="settings">
              <h2 className="settings__title">Settings</h2>
              <pre>
                Below you can customise how you would like the list scores
                grouped into tiers. {`\n\r`}You can also exclude scores by
                deselecting the checkboxes.
              </pre>
              <div className="settings__tiers">
                {tierValues.map(([k, v]) => {
                  const uid = `setting-${k}`;
                  return (
                    <div className="settings__tier" key={uid}>
                      <Tickbox
                        id={`${uid}-active`}
                        name={`${uid}-active`}
                        aria-label={`Include scores of ${k} in tiers`}
                        checked={!hiddenScores.has(k)}
                        onChange={() => this.toggleHiddenScore(k)}
                      />
                      <SelectBox
                        key={k}
                        id={`${uid}-rank`}
                        name={k}
                        text={`${k}`}
                        value={v}
                        onChange={this.handleCustomTierChange}
                      >
                        {Ranks.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </SelectBox>
                    </div>
                  );
                })}
              </div>
              <div className="button-group">
                <Button
                  onClick={() =>
                    this.setState({
                      tierDistribution: defaultTiers,
                      hiddenScores: new Set()
                    })
                  }
                >
                  Reset to defaults
                </Button>
                <Button
                  btnStyle="primary"
                  onClick={this.handlePersistCustomTierChange}
                >
                  Ok
                </Button>
              </div>
            </div>
          )}
          {hasItems && !showSettings && (
            <div className="tiers">
              {tiers.map(([tier, series]) => {
                const scores = tierValues
                  .filter(([_, t]) => t === tier)
                  .map(([s]) => s);

                return (
                  <Tier key={tier} tier={tier} scores={scores} items={series}>
                    {({ data }) => (
                      <li key={data.id}>
                        <Tooltip text={data.title} center highlight>
                          <NewTabLink href={data.url}>
                            <Image
                              isLazy={true}
                              src={data.image}
                              alt={data.title}
                              width={width}
                              height={height}
                            />
                          </NewTabLink>
                        </Tooltip>
                      </li>
                    )}
                  </Tier>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }
}
