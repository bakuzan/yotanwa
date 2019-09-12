const path = require('path');
const withSass = require('@zeit/next-sass');
const withOffline = require('next-offline');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { config } = require('dotenv');

config();

const compose = (...fs) => (x) => fs.reduce((state, gs) => gs(state), x);
const empty = 'empty';

const withSetup = (cfg) =>
  compose(
    withBundleAnalyzer({ enabled: Boolean(process.env.ANALYZE) }),
    withSass,
    withOffline
  )(cfg);

module.exports = withSetup({
  distDir: 'dist',
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
  },

  // VARIABLES
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
  }
});
