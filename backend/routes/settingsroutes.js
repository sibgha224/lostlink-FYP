const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateInstituteInfo,
  addCategory,
  removeCategory,
  updateAutomationRules
} = require('../controllers/settingscontroller');

const { protect } = require('../middleware/authmiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, getSettings);
router.put('/institute', protect, adminOnly, updateInstituteInfo);
router.post('/categories', protect, adminOnly, addCategory);
router.delete('/categories/:name', protect, adminOnly, removeCategory);
router.put('/automation', protect, adminOnly, updateAutomationRules);

module.exports = router;
