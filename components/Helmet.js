import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';

function YTWHelmet({ title, description }) {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="description" content={description} />
      {/* DefaultTheme */}
      <meta name="theme-color" content="#7f7ec2" />
      {/* DarkTheme */}
      {/* <meta name="theme-color" content="#fbd072" /> */}

      <link rel="icon" href="/static/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        href="/static/favicon-32x32.png"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="/static/favicon-16x16.png"
        sizes="16x16"
      />

      <title>{title}</title>
    </Head>
  );
}

YTWHelmet.displayName = 'YTWHelmet';
YTWHelmet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default YTWHelmet;
