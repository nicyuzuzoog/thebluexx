const mongoose = require('mongoose');
const slugify = require('slugify');

const newsSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true, trim: true },
    fr: { type: String, default: '', trim: true },
    rw: { type: String, default: '', trim: true }
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    en: { type: String, required: true },
    fr: { type: String, default: '' },
    rw: { type: String, default: '' }
  },
  summary: {
    en: { type: String, required: true, maxlength: 300 },
    fr: { type: String, default: '', maxlength: 300 },
    rw: { type: String, default: '', maxlength: 300 }
  },
  featuredImage: {
    type: String,
    required: [true, 'Please add a featured image']
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: true,
    enum: ['announcements', 'news', 'ideas', 'stories', 'jobs', 'technology', 'sports', 'entertainment', 'politics', 'business', 'health', 'education', 'culture', 'other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected'],
    default: 'pending'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    createdAt: { type: Date, default: Date.now }
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comments
newsSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'newsId',
  justOne: false
});

// Create slug
newsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title.en, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for search
newsSchema.index({
  'title.en': 'text',
  'title.fr': 'text',
  'title.rw': 'text',
  'content.en': 'text',
  'summary.en': 'text'
});

// Regular indexes
newsSchema.index({ tags: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ status: 1 });
newsSchema.index({ views: -1 });
newsSchema.index({ likesCount: -1 });
newsSchema.index({ isFeatured: 1 });
newsSchema.index({ isBreaking: 1 });
newsSchema.index({ createdAt: -1 });
newsSchema.index({ category: 1, status: 1 });
newsSchema.index({ status: 1, createdAt: -1 });
newsSchema.index({ category: 1, status: 1 });
newsSchema.index({ views: -1 });
newsSchema.index({ createdAt: -1 });

module.exports = mongoose.model('News', newsSchema);