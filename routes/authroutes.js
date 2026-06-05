const express = require('express');
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  getProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/authcontroller');
const { protect } = require('../middleware/authmiddleware');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;