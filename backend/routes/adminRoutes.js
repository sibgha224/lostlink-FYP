const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
  getDashboardStats,
  getItemStats
} = require('../controllers/adminController');

const { protect } = require('../middleware/authmiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Fix 1: Ensure path case matches your models folder file name (Settings.js)
const Settings = require('../models/settings');

// Existing Admin Routes
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/item-stats', protect, adminOnly, getItemStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/users/:id', protect, adminOnly, getUserById);
router.put('/users/:id/block', protect, adminOnly, toggleBlockUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

// --- Institute Settings Routes ---

// GET Route: Fetch Settings
router.get('/settings', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return res.status(200).json(settings);
  } catch (err) {
    console.error("GET /settings Error:", err);
    return res.status(500).json({ message: err.message });
  }
});

// PUT Route: Save / Update Institute Info
router.put('/settings/institute', protect, adminOnly, async (req, res) => {
  try {
    const { instituteName, address, supportEmail, contactNumber } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        instituteName: instituteName || "",
        address: address || "",
        supportEmail: supportEmail || "",
        contactNumber: contactNumber || ""
      });
    } else {
      if (instituteName !== undefined) settings.instituteName = instituteName;
      if (address !== undefined) settings.address = address;
      if (supportEmail !== undefined) settings.supportEmail = supportEmail;
      if (contactNumber !== undefined) settings.contactNumber = contactNumber;
    }

    const savedSettings = await settings.save();
    return res.status(200).json({ success: true, settings: savedSettings });
  } catch (err) {
    console.error("PUT /settings/institute Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;