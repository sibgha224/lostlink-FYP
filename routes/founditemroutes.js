const express = require('express');
const router = express.Router();
const {
  reportFoundItem,
  getAllFoundItems,
  getFoundItemById,
  getMyFoundItems,
  updateFoundItem,
  deleteFoundItem,
  searchFoundItems,
  approveFoundItem
} = require('../controllers/founditemcontroller');
const { protect } = require('../middleware/authmiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadmiddleware');

router.post('/report', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
}, reportFoundItem);

router.get('/all', protect, getAllFoundItems);
router.get('/my-items', protect, getMyFoundItems);
router.get('/search', protect, searchFoundItems);
router.get('/:id', protect, getFoundItemById);
router.put('/:id', protect, updateFoundItem);
router.delete('/:id', protect, deleteFoundItem);
router.put('/:id/approve', protect, adminOnly, approveFoundItem);

module.exports = router;