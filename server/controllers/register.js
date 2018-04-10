const User = require('../models/user');
const mail = require('../mail');
const helpers = require('../helpers');

module.exports = {
  attachRouteControllers(app) {
    app.post('/register', async (req, res) => {
      if (!req.body) {
        res.status(400);
        res.json({
          error: true,
          code: 'REQUIRE_BODY',
        })
        return;
      }

      const {
        email,
        username,
        password,
      } = req.body
      
      try {
        const verification_token = await helpers.randomString(30)
        const session_token = await helpers.randomString(30)
        await User.init();
        const user = new User({
          email,
          username,
          password,
          balance: 0,
          takedowns: 0,
          verified: false,
          verification_token,
          session_token,
        });
        await user.save();
        await mail.sendEmailVerification(email, verification_token);
        res.json({
          error: false,
          user: await user.serializeWithSensitiveData()
        });
      } catch (err) {
        switch (err.name) {
          case 'ValidationError':
            res.status(400);
            res.json({
              error: true,
              code: 'VALIDATION_ERROR',
              validationErrors: Object.values(err.errors)
                .map((error) => 'INVALID_' + error.path.toUpperCase()),
            })
            return;

          case 'BulkWriteError':
            const op = err.getOperation();
            res.status(400);
            res.json({
              error: true,
              code: 'VALIDATION_ERROR',
              validationErrors: [
                ...(op.email === email ? ['EMAIL_EXISTS'] : []),
                ...(op.username === username ? ['USERNAME_EXISTS'] : []),
              ],
            })
            return;

          default:
            console.error(err);
            res.status(500);
            res.json({
              error: true,
              code: '500'
            });
            return;
        }
      }
    });
  }
};
