import '../styles/search.scss';
import React from 'react';

import Helmet from '../components/Helmet';
import Button from '../components/Button';
import { NewTabLink, YTWLink } from '../components/YTWLink';
import Tier from '../components/Tier';
import Themer from '../components/Themer';
import SelectBox from '../components/SelectBox';
import Tickbox from '../components/Tickbox';
import Footer from '../components/Footer';

import { sources, types, ranks } from '../consts';
import defaultTiers from '../consts/defaultTiers';
import usingMal from '../handlers/usingMal';
import usingAnilist from '../handlers/usingAnilist';
import getUserLinks from '../utils/getUserLinks';
import generateTiers from '../utils/generateTiers';
import storage from '../utils/storage';

async function fetchListItems(source, username, type) {
  switch (source) {
    case sources.ANILIST:
      return await usingAnilist(username, type);
    case sources.MAL:
    default:
      return await usingMal(username, type);
  }
}

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      tierDistribution: new Map(),
      hiddenScores: new Set()
    };

    this.handleCustomTierChange = this.handleCustomTierChange.bind(this);
    this.handlePersistCustomTierChange = this.handlePersistCustomTierChange.bind(
      this
    );
  }

  static async getInitialProps({ query }) {
    const { source = sources.MAL, type = types.ANIME, username } = query;

    const { items, error } = await fetchListItems(source, username, type);
    const links = getUserLinks(source, username, type);

    return { items, error, username, source, type, links };
  }

  componentDidMount() {
    const { tierDistribution, hiddenScores } = storage.get();
    this.setState({
      tierDistribution: new Map(tierDistribution),
      hiddenScores: new Set(hiddenScores)
    });
  }

  handleCustomTierChange(event) {
    const { name, value } = event.target;
    this.setState((p) => ({
      tierDistribution: p.tierDistribution.set(Number(name), value)
    }));
  }

  handlePersistCustomTierChange() {
    const tierDistribution = Array.from(this.state.tierDistribution.entries());
    const hiddenScores = Array.from(this.state.hiddenScores);
    storage.set({ tierDistribution, hiddenScores });

    this.setState({ showSettings: false });
  }

  toggleHiddenScore(score) {
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
        <Helmet
          title={`${username}'s ${source} ${type} tier - Tier List Generator`}
          description={`Tier list generated using ${username}'s default ${source} ${type} list`}
        />

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
          <div>
            <Themer />
          </div>
        </header>
        <div className="tier-page__options">
          <YTWLink href="/">Back to user search</YTWLink>
          <Button
            isPrimary
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
                    <div className="settings__tier">
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
                        label={k}
                        value={v}
                        onChange={this.handleCustomTierChange}
                      >
                        {ranks.map((r) => (
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
                <Button isPrimary onClick={this.handlePersistCustomTierChange}>
                  Ok
                </Button>
              </div>
            </div>
          )}
          {hasItems && !showSettings && (
            <div className="tiers">
              {tiers.map(([tier, series]) => (
                <Tier key={tier} tier={tier} items={series} />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </section>
    );
  }
}
