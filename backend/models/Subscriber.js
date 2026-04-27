const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  name: {
    type: String,
    default: ''
  },
  subscribedTo: {
    type: String,
    enum: ['news', 'movies', 'all'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'fr', 'rw'],
    default: 'en'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscriber', subscriberSchema);