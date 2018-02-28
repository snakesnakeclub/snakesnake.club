/* eslint-env node */
const Bundler = require('parcel-bundler');

process.env.NODE_ENV = 'production';

const bundler = new Bundler('./client/index.html', {
  publicURL: '/'
});

bundler.bundle();
