var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    require: true
  },
  verified: {
    type: Boolean,
    required: true
  },
  verification_token: {
    type: String,
    required: true,
    unique: true
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
  })
})


UserSchema.statics.authenticate = function(username, password, callback) {
  User.findOne({username}, function(err, user) {
      if (err) {
          return callback(err);
      } else if (!user) {
          callback("INCORRECT_USERNAME");
      }
      bcrypt.compare(password, user.password, function(err, result) {
          if (result) {
              callback("INCORRECT_PASSWORD");
          } else {
              callback(null, user);
          }
      });
  });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;

