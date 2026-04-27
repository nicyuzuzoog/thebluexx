const mongoose = require('mongoose');

const jobVacancySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    fr: { type: String, default: '' },
    rw: { type: String, default: '' }
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    en: { type: String, required: true },
    fr: { type: String, default: '' },
    rw: { type: String, default: '' }
  },
  requirements: [{
    type: String
  }],
  salary: {
    type: String,
    default: 'Negotiable'
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time'
  },
  applicationUrl: {
    type: String,
    default: ''
  },
  applicationEmail: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobVacancy', jobVacancySchema);