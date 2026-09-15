const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/chatcontroller');
const { markItemReturned, getClaimPresence } = require('../controllers/adminchatcontroller');
const { protect } = require('../middleware/authmiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/claims/:claimId/messages', protect, adminOnly, getMessages);
router.put('/claims/:claimId/mark-returned', protect, adminOnly, markItemReturned);
router.get('/claims/:claimId/presence', protect, adminOnly, getClaimPresence);

module.exports = router;