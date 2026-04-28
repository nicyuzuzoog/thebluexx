const mongoose = require('mongoose');
const slugify = require('slugify');

const movieSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true, trim: true },
    fr: { type: String, default: '', trim: true },
    rw: { type: String, default: '', trim: true }
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    en: { type: String, required: true },
    fr: { type: String, default: '' },
    rw: { type: String, default: '' }
  },
  trailerUrl: {
    type: String,
    required: [true, 'Please add a YouTube trailer URL']
  },
  movieFileUrl: {
    type: String,
    default: ''
  },
  mediafileId: {
    type: String,
    default: ''
  },
  downloadUrl: {
    type: String,
    default: ''
  },
  poster: {
    type: String,
    default: ''
  },
  backdrop: {
    type: String,
    default: ''
  },
  genre: [{
    type: String,
    enum: [
      'action', 'comedy', 'drama', 'horror', 'romance',
      'thriller', 'sci-fi', 'documentary', 'animation',
      'adventure', 'crime', 'fantasy', 'musical', 'mystery',
      'war', 'western', 'biography', 'family', 'history',
      'sport', 'rwandan', 'african', 'other'
    ]
  }],
  duration: {
    type: String,
    default: ''
  },
  releaseYear: {
    type: Number
  },
  language: {
    type: String,
    default: 'English'
  },
  subtitles: [{
    type: String
  }],
  director: {
    type: String,
    default: ''
  },
  cast: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  addedBy: {
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
  downloads: {
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
  quality: {
    type: String,
    enum: ['360p', '480p', '720p', '1080p', '4K'],
    default: '720p'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comments
movieSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'movieId',
  justOne: false
});

// Create slug from title
movieSchema.pre('save', function (next) {
  if (this.isModified('title') && this.title.en) {
    this.slug = slugify(this.title.en, {
      lower: true,
      strict: true
    }) + '-' + Date.now();
  }
  next();
});

// ─── INDEXES (Fixed — no array field in text index) ───

// Text search index — only string fields, NOT genre (array)
movieSchema.index({
  'title.en': 'text',
  'title.fr': 'text',
  'title.rw': 'text',
  'description.en': 'text',
  director: 'text'
});

// Regular indexes for filtering & sorting
movieSchema.index({ genre: 1 });
movieSchema.index({ status: 1 });
movieSchema.index({ views: -1 });
movieSchema.index({ likesCount: -1 });
movieSchema.index({ isFeatured: 1 });
movieSchema.index({ createdAt: -1 });
movieSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Movie', movieSchema);