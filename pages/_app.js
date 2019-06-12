import '../styles/index.scss';
import React from 'react';
import App, { Container } from 'next/app';

import Helmet from '../components/Helmet';
import Themer from '../components/Themer';
import Footer from '../components/Footer';

import processCookies from '../utils/processCookies';
import processQuery from '../utils/processQuery';
import getPageMeta from '../utils/getPageMeta';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
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
      <Container>
        <Helmet {...helmetProps} />
        <Themer initialValue={cookies.isDarkTheme} />
        <Component {...pageProps} cookies={cookies} />
        <Footer />
      </Container>
    );
  }
}

export default MyApp;
