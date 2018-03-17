/* eslint-env node */
const watchClient = require('../client/scripts/watch.js');
const watchServer = require('../server/scripts/watch.js');

watchClient()
  .then(watchServer);
