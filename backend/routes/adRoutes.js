const express = require('express');
const router = express.Router();
const {
  getActiveAds, createAd, updateAd,
  deleteAd, clickAd, getAllAds
} = require('../controllers/adController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const { uploadAds } = require('../utils/helpers');

router.get('/', getActiveAds);
router.post('/:id/click', clickAd);

router.get('/all', protect, adminAuth, getAllAds);
router.post('/', protect, adminAuth, uploadAds.single('image'), createAd);
router.put('/:id', protect, adminAuth, uploadAds.single('image'), updateAd);
router.delete('/:id', protect, adminAuth, deleteAd);

module.exports = router;