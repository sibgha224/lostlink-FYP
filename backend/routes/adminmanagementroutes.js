const express = require('express');
const router = express.Router();
const {
  getAllAdmins,
  createAdmin,
  updateAdminRole,
  toggleAdminLogin,
  deleteAdmin
} = require('../controllers/adminmanagementcontroller');

const { protect } = require('../middleware/authmiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, adminOnly, getAllAdmins);
router.post('/', protect, adminOnly, createAdmin);
router.put('/:id/role', protect, adminOnly, updateAdminRole);
router.put('/:id/login', protect, adminOnly, toggleAdminLogin);
router.delete('/:id', protect, adminOnly, deleteAdmin);

module.exports = router;
