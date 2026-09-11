const express = require('express');
const router = express.Router();
const {
  getMatchesForLostItem,
  getMatchesForFoundItem,
  getMyMatches
} = require('../controllers/matchingcontroller');
const { protect } = require('../middleware/authmiddleware');

router.get('/my-matches', protect, getMyMatches);
router.get('/lost/:lostItemId', protect, getMatchesForLostItem);
router.get('/found/:foundItemId', protect, getMatchesForFoundItem);

module.exports = router;
