const User = require('../models/user');

const getAllUsers = async (req, res) => {
  try {
    
    const users = await User.find({ role: 'student' })
      .select('-password -verifyOtp -resetOtp')
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalUsers: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verifyOtp -resetOtp');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block an admin!' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: user.isBlocked ? 'User blocked successfully!' : 'User unblocked successfully!',
      isBlocked: user.isBlocked
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete an admin!' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {

    const totalStudents = await User.countDocuments({ role: 'student' });
    const verifiedStudents = await User.countDocuments({ role: 'student', isVerified: true });
    const blockedStudents = await User.countDocuments({ role: 'student', isBlocked: true });

    res.status(200).json({
      totalStudents,
      verifiedStudents,
      blockedStudents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
  getDashboardStats
};