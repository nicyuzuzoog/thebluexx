const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    fr: { type: String, default: '' },
    rw: { type: String, default: '' }
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    rw: { type: String, default: '' }
  },
  icon: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);