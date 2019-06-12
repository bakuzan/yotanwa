import classNames from 'classnames';
import Document, { Html, Head, Main, NextScript } from 'next/document';

import processCookies from '../utils/processCookies';
import { lighten, darken } from '../utils/palette';

const darkThemeColour = '#fbd072';
const lightThemeColour = '#7f7ec2';

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
        <Head>
          <style>
            {`
              .theme {
                transition: all ease-in-out 0.2s;
              }

              .theme--light {
                --base-background: #fff;
                --base-background-hover: ${darken(10, '#fff')};
                --base-contrast: #000;
                --primary-colour: ${lightThemeColour};
                --primary-colour-hover: ${darken(10, lightThemeColour)};
                --primary-contrast: #fff;
                --alt-colour: ${darkThemeColour};
                --tooltip-background: #000;
                --tooltip-colour: #fff;
              }

              .theme--dark {
                --base-background: #333333;
                --base-background-hover: ${lighten(10, '#333')};
                --base-contrast: #fff;
                --primary-colour: ${darkThemeColour};
                --primary-colour-hover: ${darken(10, darkThemeColour)}; 
                --primary-contrast: #000;
                --alt-colour: ${lightThemeColour};
                --tooltip-background: #fff;
                --tooltip-colour: #000;
              }
            `}
          </style>
        </Head>
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
