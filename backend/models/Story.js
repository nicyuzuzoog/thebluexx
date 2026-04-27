const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    fr: { type: String, default: '' },
    rw: { type: String, default: '' }
  },
  content: {
    en: { type: String, required: true },
    fr: { type: String, default: '' },
    rw: { type: String, default: '' }
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['personal', 'inspirational', 'cultural', 'historical', 'fiction', 'other'],
    default: 'personal'
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected'],
    default: 'pending'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    email: String,
    createdAt: { type: Date, default: Date.now }
  }],
  likesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);