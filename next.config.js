const withSass = require('@zeit/next-sass');

const empty = 'empty';

module.exports = withSass({
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
  // VARIABLES
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  }
});
