const path = require('path');
const withSass = require('@zeit/next-sass');
const withOffline = require('next-offline');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { config } = require('dotenv');

config();

const empty = 'empty';
const isProd = process.env.NODE_ENV === 'production';
const compose = (...fs) => (x) => fs.reduce((state, gs) => gs(state), x);

const withSetup = (cfg) =>
  compose(
    withBundleAnalyzer({ enabled: Boolean(process.env.ANALYZE) }),
    withSass,
    withOffline
  )(cfg);

module.exports = withSetup({
  distDir: 'dist',
  env: {
    API_URL_BASE: isProd
      ? 'https://yotanwa.herokuapp.com'
      : `http://localhost:${process.env.PORT}`
  },
  postcssLoaderOptions: { parser: 'postcss-scss', autoprefixer: true },
  webpack: (webpackConfig) => {
    // Fixes npm packages
    webpackConfig.node = {
      fs: empty,
      net: empty,
      tls: empty
    };

    // Aliases
    webpackConfig.resolve.alias['@'] = path.join(__dirname);

    return webpackConfig;
  }
});
