const express = require('express');
const router = express.Router();
const { getStories, getStory, createStory, deleteStory } = require('../controllers/storyController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const { upload } = require('../utils/helpers');

router.route('/')
  .get(getStories)
  .post(protect, upload.single('image'), createStory);

router.route('/:id')
  .get(getStory)
  .delete(protect, adminAuth, deleteStory);

module.exports = router;