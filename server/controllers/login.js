const User = require('../models/user');
const helpers = require('../helpers');

module.exports = {
  attachRouteControllers(app) {
    app.post('/login', (req, res) => {
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
        password,
      } = req.body

      User.findOne({ email }, async (err, user) => {
        if (err) {
          res.status(500);
          res.json({
            error: true,
            code: '500',
          });
          return;
        } if (!user) {
          res.status(400);
          res.json({
            error: true,
            code: 'VALIDATION_ERROR',
            validationErrors: [
              'INCORRECT_EMAIL'
            ]
          });
          return;
        }

        User.authenticate(email, password, async (errorCode, success) => {
          if (errorCode) {
            res.status(400);
            res.json({
              error: true,
              code: 'VALIDATION_ERROR',
              validationErrors: [
                errorCode,
              ]
            });
            return;
          }

          // Give the user a session_token
          try {
            const token = await helpers.randomString(30)
            user.session_token = token;
            await user.save();
            res.json({
              error: false,
              user: user.serializeWithSensitiveData(),
            });
          } catch (error) {
            console.error(error);
            res.status(500);
            res.json({
              error: true,
              code: '500',
            });
          }
        });
      });
    });

    app.post('/login-token', (req, res) => {
      if (!req.body) {
        res.status(400);
        res.json({
          error: true,
          code: 'REQUIRE_BODY',
        })
        return;
      }

      const {
        session_token,
      } = req.body;

      if (!session_token) {
        res.status(400);
        res.json({
          error: true,
          code: 'INVALID_TOKEN'
        });
        return
      }

      User.findOne({ session_token }, (error, user) => {
        if (error) {
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

        res.json({
          error: false,
          user: user.serializeWithSensitiveData()
        });
      });
    })
  },

  attachSocketControllers(socket) {
    socket.on('login-token', token => {
      if (!token) {
        socket.emit('login-token->res', 'INVALID_TOKEN', null);
        return
      }
      User.findOne({ session_token: token }, async (err, user) => {
        if (err) {
          socket.emit('login-token->res', 500, null);
          return;
        }
        
        if (!user) {
          socket.emit('login-token->res', 'INVALID_TOKEN', null);
          return;
        }

        socket.session_token = token;
        user.balance += socket.verifiedShares - socket.attributedVerifiedShares
        socket.attributedVerifiedShares = socket.verifiedShares;
        await user.save()
        socket.emit('login-token->res', false, user.serializeWithSensitiveData());
      });
    });
  },
}
