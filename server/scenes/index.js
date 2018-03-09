const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const resetPassword = require('./reset-password');

module.exports = {
  set : function(app, socket) {
    register.setSocketControllers(socket);
    register.setRouteControllers(app);
    resetPassword.setSocketControllers(socket);
    resetPassword.setRouteControllers(app);
    login.set(socket);
    logout.set(socket);
  }
}
