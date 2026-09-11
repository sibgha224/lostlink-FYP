const express = require('express');
const router = express.Router();
const { submitReview, getUserReviews, getMyGivenReviews } = require('../controllers/reviewcontroller');
const { protect } = require('../middleware/authmiddleware');

router.post('/', protect, submitReview);
router.get('/my-reviews', protect, getMyGivenReviews);
router.get('/user/:userId', protect, getUserReviews);

module.exports = router;
