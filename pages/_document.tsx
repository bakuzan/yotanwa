import classNames from 'classnames';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document';

import processCookies from '../utils/processCookies';

type DocumentProps = {
  cookies: any;
};

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const { req } = ctx;
    const cookies = processCookies(req ? req.headers.cookie : '');

    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps, cookies };
  }

  render() {
    const { cookies = { isDarkTheme: false } } = this.props;

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
