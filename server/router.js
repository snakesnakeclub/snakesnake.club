var User = require('./user');

module.exports = {

  set : function(app) {

    app.get('/verify/:token', function(req, res) {
      let token = req.params.token;
      User.updateOne(
        {verification_token : token},
        {$set : {"verified": true,
                 "verification_token": null}}, function(err, result) {
                    if (err || !result) {
                      res.status(400);
                    } else console.log('validated');
                 })
      res.redirect('/');
    });
  }

}
