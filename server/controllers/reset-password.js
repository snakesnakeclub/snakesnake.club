const isEmail = require('validator/lib/isEmail');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const User = require('../models/user');
const mail = require('../mail');
const helpers = require('../helpers');
const resetPasswordPageTemplate = Handlebars.compile(String(fs.readFileSync(
  path.join(__dirname, '../templates/page-reset-password.handlebars'))));

module.exports = {
  attachRouteControllers(app) {
    app.post('reset-password', (req, res) => {
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
      } = req.body

      if (!isEmail(email)) {
        socket.emit('reset-password->res', 'INVALID_EMAIL')
        return
      }

      User.findOne({ email }, async (err, user) => {
        if (err) {
          console.error(err);
          socket.emit('reset-password->res', 500);
        } else if (!user) {
          socket.emit('reset-password->res', 'INVALID_EMAIL');
        } else {
          const token = await helpers.randomString(30)
          socket.emit('reset-password->res', false);
          user.password_token = token
          await user.save()
          await mail.sendPasswordReset(email, token);
        }
      });
    });

    app.get('/reset-password/:token', (req, res) => {
      User.findOne({
        password_token: req.params.token
      }, (err, result) => {
        if (err) {
          res.status(500);
        } else if (!result) {
          res.status(400);
          res.send('INVALID_TOKEN')
        } else {
          res.set('Content-Type', 'text/html');
          res.send(resetPasswordPageTemplate({
            passwordToken: req.params.token,
          }));
        }
      });
    });

    app.post('/reset-password/:token', (req, res) => {
      const token = req.params.token;
      const password = req.body.password;
      User.findOne({
        password_token: token
      }, async (err, user) => {
        if (err) {
          res.status(500);
          return
        } else if (!user) {
          res.status(400);
          res.send('INVALID_TOKEN');
          return
        }
        user.password = password
        user.password_token = null
        await user.save()
        res.redirect('/');
      });
    });
  }
};

