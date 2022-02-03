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

export async function getServerSideProps(ctx: DocumentContext) {
  const { req } = ctx;
  const cookies = processCookies(req ? req.headers.cookie : '');

  const initialProps = await Document.getInitialProps(ctx);

  return { ...initialProps, cookies };
}

class MyDocument extends Document<DocumentProps> {
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
