const User = require('../models/user');

module.exports = {

  set(app) {
    app.get('/verify/:token', (req, res) => {
      const token = req.params.token;
      User.updateOne(
        {verification_token: token},
        {$set:
          {verified: true,
            verification_token: null}}, (err, result) => {
          if (err || !result) {
            res.status(400);
          }
        });
      res.redirect('/');
    });
  }

};
