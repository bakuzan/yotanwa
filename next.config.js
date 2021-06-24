const path = require('path');
const withOffline = require('next-offline');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { config } = require('dotenv');

config();

const empty = 'empty';
const isProd = process.env.NODE_ENV === 'production';
const compose =
  (...fs) =>
  (x) =>
    fs.reduce((state, gs) => gs(state), x);

const withSetup = (cfg) =>
  compose(
    withBundleAnalyzer({ enabled: Boolean(process.env.ANALYZE) }),
    withOffline
  )(cfg);

module.exports = withSetup({
  distDir: 'dist',
  env: {
    API_URL_BASE: isProd
      ? 'https://yotanwa.herokuapp.com'
      : `http://localhost:${process.env.PORT}`
  },
  generateInDevMode: false, // next-offline: for service work
  postcssLoaderOptions: { parser: 'postcss-scss', autoprefixer: true },
  webpack: (webpackConfig) => {
    // Fixes npm packages
    webpackConfig.resolve.fallback = {
      ...(webpackConfig.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false
    };

    // Aliases
    webpackConfig.resolve.alias['@'] = path.join(__dirname);

    return webpackConfig;
  }
});
