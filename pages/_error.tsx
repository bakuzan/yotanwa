import React from 'react';
import Head from 'next/head';

import { YTWLink } from '../components/YTWLink';

interface ErrorProps {
  statusCode: string;
  title?: string;
}

const statusCodes = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error'
};

class YTWError extends React.Component<ErrorProps> {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    const title =
      this.props.title ||
      statusCodes[statusCode] ||
      'An unexpected error has occurred';

    return (
      <div style={styles.error}>
        <Head>
          <title>
            {statusCode}: {title}
          </title>
        </Head>
        <div>
          {statusCode ? <h1 style={styles.h1}>{statusCode}</h1> : null}
          <div style={styles.desc}>
            <h2 style={styles.h2}>{title}.</h2>
          </div>
        </div>
        <div style={{ margin: 10 }}>
          <YTWLink href="/">Return to home</YTWLink>
        </div>
      </div>
    );
  }
}

/* tslint:disable:object-literal-sort-keys */
const styles = {
  error: {
    background: 'var(--base-background)',
    color: 'var(--base-colour)',
    height: '100vh',
    textAlign: 'center' as 'center',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  desc: {
    display: 'inline-block',
    textAlign: 'left' as 'left',
    lineHeight: '49px',
    height: '49px',
    verticalAlign: 'middle'
  },

  h1: {
    display: 'inline-block',
    borderRight: '1px solid var(--primary-colour)',
    margin: 0,
    marginRight: '20px',
    padding: '10px 23px 10px 0',
    fontSize: '24px',
    fontWeight: 500,
    verticalAlign: 'top'
  },

  h2: {
    fontSize: '14px',
    fontWeight: 'normal' as 'normal',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0
  }
};

export default YTWError;
