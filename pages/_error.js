import React from 'react';
import Error from 'next/error';

import { YTWLink } from '../components/YTWLink';

class YTWError extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    return (
      <div>
        <Error statusCode={errorCode} />
        <div>
          <YTWLink href="/">Return to home</YTWLink>
        </div>
      </div>
    );
  }
}

export default YTWError;
