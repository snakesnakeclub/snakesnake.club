/* eslint-env node */
const nodemon = require('nodemon');
const Bundler = require('parcel-bundler');
const fs = require('fs-extra');
const path = require('path');

const bundler = new Bundler('./client/index.html', {
  watch: true,
  publicURL: '/',
  hmr: false
});

bundler.bundle()
  .then(async () => {
    await fs.remove('./dist/static')
    await fs.copy('./client/static', './dist/static')
    
    nodemon({
      script: './server/index.js',
      ignore: ['.cache/*', 'dist/*', 'node_modules']
    });
    
    nodemon
    .on('start', () => {
      console.log('App has started');
    })
    .on('quit', () => {
      console.log('App has quit');
      process.exit();
    })
    .on('restart', files => {
      const relativeFiles = files.map(file => path.relative(path.resolve(__dirname, '..'), file));
      console.log('App restarted due to:', relativeFiles)
      relativeFiles.forEach(file => {
          if (file.startsWith('client/static')) {
            fs.copy(file, file.replace(/^client\/static/i, 'dist/static'))
          }
        })
    });
  });
