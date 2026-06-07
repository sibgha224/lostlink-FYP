const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
  getDashboardStats
} = require('../controllers/adminController');

const { protect } = require('../middleware/authmiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/users/:id', protect, adminOnly, getUserById);
router.put('/users/:id/block', protect, adminOnly, toggleBlockUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;