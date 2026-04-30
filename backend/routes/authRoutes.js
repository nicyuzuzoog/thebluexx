const express = require('express');
const router = express.Router();
const {
  register, login, getMe,
  updateProfile, changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadAvatars } = require('../utils/helpers');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadAvatars.single('avatar'), updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;