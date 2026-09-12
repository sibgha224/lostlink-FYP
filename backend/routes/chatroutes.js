const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markMessagesRead,
  editMessage,
  deleteMessage
} = require('../controllers/chatcontroller');
const { protect } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');

router.post('/:claimId', protect, (req, res, next) => {
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }, { name: 'file', maxCount: 1 }])(req, res, (err) => {
    if (err) return res.status(400).json({ message: 'Upload failed', error: err.message });
    next();
  });
}, sendMessage);

router.get('/:claimId', protect, getMessages);
router.put('/:claimId/read', protect, markMessagesRead);
router.put('/message/:messageId', protect, editMessage);
router.delete('/message/:messageId', protect, deleteMessage);

module.exports = router;