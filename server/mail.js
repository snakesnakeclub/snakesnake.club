const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	secure: false, // True for 465, false for other ports
	auth: {
		user: '2aa25f7a76e897',
		pass: '67104bae3640b4'
	}
});

module.exports = {

	sendEmailConfirmation(email, token) {
		const mailOptions = {
			from: 'SnakeSnake <snake@snakesnake.club>',
			to: email,
			subject: 'Email Confirmation',
			text: 'Visit the link : http://localhost:3000/verify/' + token,
			html: '<b>Click the link : <a href="http://localhost:3000/verify/' + token + '">Confirm</b>'
		};

    transporter.sendMail(mailOptions, (err, info) => {
    	if (err) {
    		return console.log(err);
    	}
    });
	},

	sendPasswordReset(email, token) {
		const mailOptions = {
			from: 'SnakeSnake',
			to: email,
			subject: 'Password Confirmation',
			text: String('Visit the link : http://localhost:3000/verifypassword/' + token),
			html: '<b>Click the link : <a href="http://localhost:3000/verifypassword/' + token + '">Confirm</b>'
		};

    transporter.sendMail(mailOptions, (err, info) => {
    	if (err) {
    		return console.log(err);
    	}
    });
	}

};
