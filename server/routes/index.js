const login = require('./login');
const register = require('./register');
const resetPassword = require('./reset-password');
const resetVerification = require('./reset-verification');
const logout = require('./logout');
const ping = require('./ping');

module.exports = {
  attachRoutes(app, recaptcha) {
    login.attachRoute(app);
    register.attachRoute(app, recaptcha);
    resetPassword.attachRoute(app, recaptcha);
    resetVerification.attachRoute(app);
    logout.attachRoute(app);
    ping.attachRoute(app);
  }
};
