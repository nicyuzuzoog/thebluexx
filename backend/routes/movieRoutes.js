const express = require('express');
const router = express.Router();
const {
  getMovies, getMovieBySlug, createMovie, updateMovie, deleteMovie,
  likeMovie, trackDownload, shareMovie
} = require('../controllers/movieController');
const { protect, optionalAuth } = require('../middleware/auth');
const { publisherAuth } = require('../middleware/adminAuth');
const { upload } = require('../utils/helpers');

router.route('/')
  .get(getMovies)
  .post(protect, publisherAuth, upload.single('poster'), createMovie);

router.route('/:slug')
  .get(getMovieBySlug);

router.route('/:id')
  .put(protect, publisherAuth, upload.single('poster'), updateMovie)
  .delete(protect, publisherAuth, deleteMovie);

router.post('/:id/like', optionalAuth, likeMovie);
router.post('/:id/download', trackDownload);
router.post('/:id/share', shareMovie);

module.exports = router;