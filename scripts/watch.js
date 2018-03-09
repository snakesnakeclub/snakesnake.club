/* eslint-env node */
const nodemon = require('nodemon');
const Bundler = require('parcel-bundler');

const bundler = new Bundler('./client/index.html', {
  watch: true,
  publicURL: '/',
  hmr: false
});

bundler.bundle()
  .then(() => {
    nodemon({
      script: './server/index.js',
      ignore: ['.cache/*', 'dist/*', 'node_modules']
    });

    nodemon.on('start', () => {
      console.log('App has started');
    }).on('quit', () => {
      console.log('App has quit');
      process.exit();
    }).on('restart', files => {
      console.log('App restarted due to: ', files);
    });
  });
