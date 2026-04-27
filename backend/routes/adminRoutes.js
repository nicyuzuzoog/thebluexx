const express = require('express');
const router = express.Router();
const {
  getDashboard, getUsers, createPublisher, updateUserRole,
  toggleUserStatus, deleteUser, getPendingContent, updateContentStatus,
  getAllNews, getAllMovies
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.use(protect);
router.use(adminAuth);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.post('/publishers', createPublisher);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/pending', getPendingContent);
router.put('/content/:type/:id/status', updateContentStatus);
router.get('/news', getAllNews);
router.get('/movies', getAllMovies);

module.exports = router;