const mongoose = require('mongoose');

const SkinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[\w\d]+$/i
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: true
  }
});

const Skin = mongoose.model('Skin', SkinSchema);
module.exports = Skin;
