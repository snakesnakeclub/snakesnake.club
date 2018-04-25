/* eslint-env node */
const fs = require('fs-extra');
const path = require('path');
const Bundler = require('parcel-bundler');

async function watchWithBundler() {
  const bundler = new Bundler('./client/index.html', {
    publicURL: '/',
    watch: true,
    hmr: false
  });

  await bundler.bundle();
}

async function watchStaticDirectory() {
  await fs.remove('./dist/static');
  await fs.symlink('../client/static', './dist/static', 'dir');
}

module.exports = async function watch() {
  await fs.remove('./dist');
  await watchWithBundler();
  await watchStaticDirectory();
};
