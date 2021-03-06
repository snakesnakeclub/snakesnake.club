const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const isEmailBlacklisted = require('../validation/is-email-blacklisted.js');
const Skin = require('./skin');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 254,
    validate: {
      validator: email => isEmail(email) && !isEmailBlacklisted(email)
    }
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 25,
    match: /^\w[\w\d]+$/i
  },
  balance: {
    type: Number
  },
  takedowns: {
    type: Number
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 256
  },
  verified: {
    type: Boolean,
    required: true
  },
  verification_token: {
    type: String
  },
  session_token: {
    type: String
  },
  password_token: {
    type: String
  },
  active_skin: {
    type: mongoose.Schema.ObjectId,
    ref: 'Skin',
    required: false
  },
  owned_skins: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Skin'
    }],
    required: true,
    default: []
  }
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({$or: [{email}, {username: email}]}, (err, user) => {
    if (err) {
      return callback(err);
    }

    if (!user) {
      callback('USER_NOT_FOUND');
      return;
    }

    bcrypt.compare(password, user.password, (err, success) => {
      if (!success) {
        callback('INCORRECT_PASSWORD');
        return;
      }
      callback(null, user);
    });
  });
};

UserSchema.methods.serializeWithSensitiveData = async function () {
  return {
    session_token: this.session_token,
    email: this.email,
    username: this.username,
    balance: this.balance,
    takedowns: this.takedowns,
    active_skin: this.active_skin && await Skin.findOne({_id: this.active_skin}),
    owned_skins: this.owned_skins && await Promise.all(this.owned_skins.map(skin => Skin.findOne({_id: skin})))
  };
};

var User = mongoose.model('User', UserSchema);
module.exports = User;

