/* eslint-env node */
const Bundler = require('parcel-bundler');
const fs = require('fs-extra');

process.env.NODE_ENV = 'production';

const bundler = new Bundler('./client/index.html', {
  publicURL: '/'
});

bundler.bundle()
  .then(async () => {
    await fs.remove('./dist/static')
    await fs.copy('./client/static', './dist/static')
  });
