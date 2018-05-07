module.exports = {
  attachRoute(app) {
    app.get('/ping', (req, res) => {
      res.send('pong');
    });
  }
};
