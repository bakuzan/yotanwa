import classNames from 'classnames';
import Document, { Html, Head, Main, NextScript } from 'next/document';

import processCookies from '../utils/processCookies';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const { req } = ctx;
    const cookies = processCookies(req ? req.headers.cookie : '');

    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps, cookies };
  }

  render() {
    const { cookies } = this.props;
    return (
      <Html>
        <Head />
        <body
          className={classNames('theme', {
            'theme--light': !cookies.isDarkTheme,
            'theme--dark': cookies.isDarkTheme
          })}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
