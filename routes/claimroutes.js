const express = require('express');
const router = express.Router();
const {
  submitClaim,
  getClaimsByItem,
  updateClaimStatus,
  getMyClaims
} = require('../controllers/claimcontroller');
const { protect } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');

router.post('/submit', protect, (req, res, next) => {
  upload.single('proofImage')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
}, submitClaim);

router.get('/my-claims', protect, getMyClaims);
router.get('/:foundItemId/claims', protect, getClaimsByItem);
router.put('/:claimId/status', protect, updateClaimStatus);

module.exports = router;