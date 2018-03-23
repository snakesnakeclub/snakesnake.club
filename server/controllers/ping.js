module.exports = {
  attachRouteControllers(app) {
    app.get('/ping', (req, res) => {
      res.send('pong');
    })
  }
}
