const validator = require('validator');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const User = require('../models/user');
const mail = require('./mail');
const helpers = require('./helpers');
const resetPasswordPageTemplate = Handlebars.compile(String(fs.readFileSync(
  path.join(__dirname, '../templates/page-reset-password.handlebars'))));

module.exports = {
  setSocketControllers(socket) {
    socket.on('reset-password', email => {
      if (!validator.isEmail(email)) {
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
            .catch(() => {
              socket.emit('reset-password->res', 500);
            });
          socket.emit('reset-password->res', false);
          user.password_token = token
          user.save()
          mail.sendPasswordReset(email, token);
        }
      });
    });
  },

  setRouteControllers(app) {
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
      }, (err, user) => {
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
        user.save()
        res.redirect('/');
      });
    });
  }
};

