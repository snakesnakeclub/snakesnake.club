/* eslint-env node */
const Bundler = require('parcel-bundler');
const fs = require('fs-extra');

module.exports = async function build() {
  const bundler = new Bundler('./client/index.html', {
    publicURL: '/',
    watch: false
  });

  await fs.remove('./dist');
  await bundler.bundle();
  await fs.copy('./client/static', './dist/static');
};
