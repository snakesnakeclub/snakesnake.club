var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 25,
    match: /^\w(\w|\d)+$/
  },
  balance: {
    type: Number,
  },
  takedowns: {
    type: Number,
  },
  password: {
    type: String,
    require: true,
  },
  verified: {
    type: Boolean,
    required: true
  },
  verification_token: {
    type: String,
  },
  session_token: {
    type: String,
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


UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email }, function(err, user) {
      if (err) {
        return callback(err);
      } else if (!user) {
        callback("INVALID_EMAIL");
        return
      }

      bcrypt.compare(password, user.password, function(err, success) {
        if (!success) {
          callback("INVALID_PASSWORD");
          return
        }
        callback(null, user);
      });
  });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;

