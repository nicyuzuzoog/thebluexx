const express = require('express');
const router = express.Router();
const { createComment, getComments, likeComment, deleteComment } = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.route('/')
  .get(getComments)
  .post(optionalAuth, createComment);

router.post('/:id/like', likeComment);
router.delete('/:id', protect, adminAuth, deleteComment);

module.exports = router;