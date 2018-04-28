const User = require('../models/user');

module.exports = {
  attachRouteControllers(app) {
    app.post('/logout', (req, res) => {
      if (!req.body) {
        res.status(400);
        res.json({
          error: true,
          code: 'REQUIRE_BODY'
        });
        return;
      }

      const {
        session_token
      } = req.body;

      // Remove the session_token
      User.findOne({session_token}, async (err, user) => {
        if (err) {
          console.error(err);
          res.status(500);
          res.json({
            error: true,
            code: '500'
          });
          return;
        }

        if (!user) {
          res.status(400);
          res.json({
            error: true,
            code: 'INVALID_TOKEN'
          });
          return;
        }

        user.session_token = null;
        await user.save();
        res.json({
          error: false
        });
      });
    });
  }
};
