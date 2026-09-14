const User = require('../models/user');
const bcrypt = require('bcryptjs');

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'co-admin'] } })
      .select('-password -verifyOtp -resetOtp')
      .sort({ createdAt: -1 });

    const total = admins.length;
    const adminCount = admins.filter((a) => a.role === 'admin').length;
    const coAdminCount = admins.filter((a) => a.role === 'co-admin').length;
    const activeCount = admins.filter((a) => !a.isBlocked).length;

    res.status(200).json({
      total,
      adminCount,
      coAdminCount,
      activeCount,
      admins
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only a full Admin can add new admins' });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide name, email, password and role' });
    }

    if (!['admin', 'co-admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be Admin or Co-Admin' });
    }

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character'
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      isVerified: true
    });

    res.status(201).json({
      message: 'Admin added successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isBlocked: admin.isBlocked,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAdminRole = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only a full Admin can change roles' });
    }

    const { role } = req.body;
    if (!['admin', 'co-admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be Admin or Co-Admin' });
    }

    const target = await User.findById(req.params.id);
    if (!target || !['admin', 'co-admin'].includes(target.role)) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (target._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot remove your own Admin role' });
    }

    target.role = role;
    await target.save();

    res.status(200).json({ message: 'Role updated successfully', role: target.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleAdminLogin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only a full Admin can enable or disable login' });
    }

    const target = await User.findById(req.params.id);
    if (!target || !['admin', 'co-admin'].includes(target.role)) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (target._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot disable your own login' });
    }

    target.isBlocked = !target.isBlocked;
    await target.save();

    res.status(200).json({
      message: target.isBlocked ? 'Login disabled for this admin' : 'Login enabled for this admin',
      isBlocked: target.isBlocked
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only a full Admin can remove admins' });
    }

    const target = await User.findById(req.params.id);
    if (!target || !['admin', 'co-admin'].includes(target.role)) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (target._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot remove your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Admin removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllAdmins,
  createAdmin,
  updateAdminRole,
  toggleAdminLogin,
  deleteAdmin
};
