const validator = require('validator');
const User = require('./user');
const mail = require('./mail');
const helpers = require('./helpers');

module.exports = {

	setSocket(socket) {
    socket.on('resetpswd', email => {
    	if (validator.isEmail(email)) {
        User.findOne({email}, async (err, user) => {
        	if (err) {
socket.emit('resetpswd->res', 500);
        	} else if (!user) {
socket.emit('resetpswd->res', 'INVALID_EMAIL');
        	} else {
        		const token = await helpers.randomString(30).catch(() => {
              socket.emit('resetpswd->resp', 500);
        		});
            User.updateOne({email}, {$set: {password_token: token}}, (err, result) => {
            	if (err) {
socket.emit('resetpswd->res', 500);
            	} else {
                socket.emit('resetpswd->resp', false);
                mail.sendPasswordReset(email, token);
            	}
            });
        	}
        });
    	}
    });
	},

	setRoute(app) {
    app.get('/resetpassword/:token', (req, res) => {
      User.findOne({password_token: req.body.token}, (err, result) => {
      	if (err) {
res.status(500);
      	} else if (!result) {
res.status('INVALID_TOKEN');
      	} else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.send('<html><body><form method=\'POST\' action=\'/resetpassword/' + req.body.token + '><input type=\'password\' name=\'password\' /><input type=\'password\' name=\'confirmpassword\' /><input type=\'submit\' /></form></body></html>');
      	}
      });
    });

    app.post('/resetpassword/:token', (req, res) => {
    	const token = req.body.token;
    	const password = req.body.password;
    	const password2 = req.boyd.confirmpassword;
    	if (password == password2) {
          User.getOne({password_token: req.body.token}, {$set, password: newpassword}, (err, result) => {
          	if (err) {
res.status(500);
          	} else if (!result) {
res.status('INVALID_TOKEN');
          	} else {
                res.redirect('/');
          	}
          });
    	} else {
            res.status('PASSWORDS_DON\'T_MATCH');
    	}
    });
	}
};

