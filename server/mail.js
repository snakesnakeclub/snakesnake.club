const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const stripTags = require('striptags')
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  SMTP_FROM,
  CLIENT_URL,
} = require('./credentials.js')
const verificationMailTemplate = Handlebars.compile(String(fs.readFileSync(
  path.join(__dirname, './templates/mail-verification.handlebars'))));
const resetPasswordMailTemplate = Handlebars.compile(String(fs.readFileSync(
  path.join(__dirname, './templates/mail-reset-password.handlebars'))));

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  }
});

const defaultOptions = {
  from: `snakesnake.club <${SMTP_FROM}>`,
}

module.exports = {
  sendEmailVerification(toEmail, verificationToken) {
    const html = verificationMailTemplate({
      CLIENT_URL,
      verificationToken,
    })
    const text = stripTags(html)
    return new Promise((resolve, reject) => {
      console.log(`${toEmail}\nSubject: ${subject}\n${text}`)
      transporter.sendMail({
        ...defaultOptions,
        to: toEmail,
        subject: 'Email Verification Request',
        text,
        html
      }, (err, info) => {
        if (err) {
          reject(err)
          return
        }
        resolve(info)
      });
    });
  },

  sendPasswordReset(toEmail, passwordToken) {
    const html = resetPasswordMailTemplate({
      CLIENT_URL,
      passwordToken,
    });
    const text = stripTags(html);
    return new Promise((resolve, reject) => {
      console.log(`${toEmail}\nSubject: ${subject}\n${text}`)
      transporter.sendMail({
        ...defaultOptions,
        to: toEmail,
        subject: 'Reset Password Request',
        text,
        html,
      }, (err, info) => {
        if (err) {
          reject(err)
          return
        }
        resolve(info)
      });
    })
  }

};
