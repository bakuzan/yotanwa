import '../styles/index.scss';
import * as React from 'react';
import App from 'next/app';
import fetch from 'node-fetch';

import Helmet, { HelmetProps } from '../components/Helmet';
import Themer from '../components/Themer';
import { YTWLink } from '../components/YTWLink';
import Footer from '../components/Footer';

import processCookies from '../utils/processCookies';
import processQuery from '../utils/processQuery';
import getPageMeta from '../utils/getPageMeta';

type AppProps = {
  cookies: any;
  helmetProps: HelmetProps;
};

class MyApp extends App<AppProps> {
  static async getInitialProps({ Component, ctx }) {
    global['fetch'] = fetch; // Adding fetch to node, the "Dirty Way"

    const { pathname, req, query } = ctx;
    const params = processQuery(query);
    const cookies = processCookies(req ? req.headers.cookie : '');
    const helmetProps = getPageMeta(pathname, params);
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, cookies, helmetProps };
  }

  render() {
    const { Component, pageProps, cookies, helmetProps } = this.props;

    return (
      <React.Fragment>
        <Helmet {...helmetProps} />
        <div className="app-header">
          <nav className="app-header__nav">
            <YTWLink nav href="/">
              series
            </YTWLink>
            <YTWLink nav href="/characters">
              characters
            </YTWLink>
          </nav>
          <div className="flex flex--all"></div>
          <Themer initialValue={cookies.isDarkTheme} />
        </div>
        <main>
          <Component {...pageProps} cookies={cookies} />
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export default MyApp;
