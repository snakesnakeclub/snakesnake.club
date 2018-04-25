/* eslint-env node */
const nodemon = require('nodemon');
const credentials = require('../credentials');

module.exports = function watch() {
  nodemon({
    script: './server/index.js',
    watch: ['server']
  });

  nodemon.on('start', async () => {
    console.log(`Server started on port ${credentials.PORT}`);
  });

  nodemon.on('quit', () => {
    process.exit();
  });
};
