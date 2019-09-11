const withSass = require('@zeit/next-sass');
const withOffline = require('next-offline');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { config } = require('dotenv');

config();

const compose = (...fs) => (x) => fs.reduce((state, fs) => fs(state), x);
const empty = 'empty';

const withSetup = (config) =>
  compose(
    withBundleAnalyzer({ enabled: Boolean(process.env.ANALYZE) }),
    withSass,
    withOffline
  )(config);

module.exports = withSetup({
  postcssLoaderOptions: { parser: 'postcss-scss', autoprefixer: true },
  webpack: (config) => {
    // Fixes npm packages
    config.node = {
      fs: empty,
      net: empty,
      tls: empty
    };

    return config;
  },
  distDir: 'dist',
  // VARIABLES
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  }
});
