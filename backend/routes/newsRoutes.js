const express = require('express');
const router = express.Router();
const {
  getNews, getNewsBySlug, createNews, updateNews,
  deleteNews, likeNews, shareNews,
  getMostViewed, getBreakingNews
} = require('../controllers/newsController');
const { protect, optionalAuth } = require('../middleware/auth');
const { publisherAuth } = require('../middleware/adminAuth');
const { uploadNews } = require('../utils/helpers');

router.get('/most-viewed', getMostViewed);
router.get('/breaking', getBreakingNews);

router.route('/')
  .get(getNews)
  .post(protect, publisherAuth, uploadNews.single('featuredImage'), createNews);

router.route('/:slug')
  .get(getNewsBySlug);

router.route('/:id')
  .put(protect, publisherAuth, uploadNews.single('featuredImage'), updateNews)
  .delete(protect, publisherAuth, deleteNews);

router.post('/:id/like', optionalAuth, likeNews);
router.post('/:id/share', shareNews);

module.exports = router;