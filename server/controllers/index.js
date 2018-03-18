const login = require('./login');
const register = require('./register');
const resetPassword = require('./reset-password');
const resetVerification = require('./reset-verification');
const logout = require('./logout');
const ping = require('./ping');

module.exports = {
  attachRouteControllers: function (app) {
    login.attachRouteControllers(app);
    register.attachRouteControllers(app);
    resetPassword.attachRouteControllers(app);
    resetVerification.attachRouteControllers(app);
    logout.attachRouteControllers(app);
    ping.attachRouteControllers(app);
  },
  attachSocketControllers: function(socket) {
    login.attachSocketControllers(socket);
    logout.attachSocketControllers(socket);
  }
}
