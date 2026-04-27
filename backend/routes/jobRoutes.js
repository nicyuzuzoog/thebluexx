const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.route('/')
  .get(getJobs)
  .post(protect, adminAuth, createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, adminAuth, updateJob)
  .delete(protect, adminAuth, deleteJob);

module.exports = router;