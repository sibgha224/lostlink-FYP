const express = require('express');
const router = express.Router();
const {
  submitLostFollowup,
  submitFoundHandover,
  submitUnblockRequest,
  submitGeneralIssue,
  getMyRequests,
  getAllRequests,
  resolveRequest,
  getReportMessages,
  sendReportMessage,
  closeReport
} = require('../controllers/requestcontroller');

const { protect } = require('../middleware/authmiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/lost-followup', protect, submitLostFollowup);
router.post('/found-handover', protect, submitFoundHandover);
router.post('/unblock', submitUnblockRequest);
router.post('/general-issue', protect, submitGeneralIssue);
router.get('/my-requests', protect, getMyRequests);
router.get('/all', protect, adminOnly, getAllRequests);
router.put('/:id/resolve', protect, adminOnly, resolveRequest);
router.get('/:id/messages', protect, getReportMessages);
router.post('/:id/messages', protect, sendReportMessage);
router.put('/:id/close', protect, adminOnly, closeReport);

module.exports = router;