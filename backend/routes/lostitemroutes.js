const express = require('express');
const router = express.Router();
const {
  reportLostItem,
  getAllLostItems,
  getLostItemById,
  getMyLostItems,
  updateLostItem,
  deleteLostItem,
  searchLostItems
} = require('../controllers/lostitemcontroller');
const { protect } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');

router.post('/report', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
}, reportLostItem);

router.get('/all', protect, getAllLostItems);
router.get('/my-items', protect, getMyLostItems);
router.get('/search', protect, searchLostItems);
router.get('/:id', protect, getLostItemById);
router.put('/:id', protect, updateLostItem);
router.delete('/:id', protect, deleteLostItem);

module.exports = router;