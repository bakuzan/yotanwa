import '../styles/home.scss';
import React from 'react';

import Input from '../components/Input';
import RadioGroup from '../components/RadioGroup';
import Button from '../components/Button';
import Loader from '../components/Loader';

import { sourceOptions, typeOptions } from '@/consts/queryOptions';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      isLoading: false
    };

    this.timer = null;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.setState({ submitted: true }, () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.setState({ isLoading: true }), 250);
    });
  }

  render() {
    const { submitted, isLoading } = this.state;

    return (
      <div className="page page--column">
        <div className="search-form">
          <h1>Tier List User Search</h1>
          <p>Pick a user and source site to generate the tiered list from.</p>
          <form
            name="search"
            action="/search"
            method="GET"
            onSubmit={this.onSubmit}
          >
            <Input
              id="username"
              name="username"
              label="Username"
              required
              disabled={isLoading}
            />
            <div className="search-form__options">
              <RadioGroup
                name="source"
                label="Source"
                options={sourceOptions}
                required
                disabled={isLoading}
              />
              <RadioGroup
                name="type"
                label="Type"
                options={typeOptions}
                required
                disabled={isLoading}
              />
            </div>
            <br />
            <div className="button-group">
              {isLoading ? (
                <Loader />
              ) : (
                <Button
                  type="submit"
                  className="search-form__submit"
                  isPrimary
                  disabled={submitted}
                >
                  Search
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}
