const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// Direct se User model lo
const User = require('../models/User');

// ───── REGISTER ─────
const register = async (req, res) => {
  try {
    const { name, email, password, rollNo, department, shift } = req.body;

    if (!name || !email || !password || !rollNo) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      rollNo,
      department,
      shift
    });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendEmail(
      user.email,
      'LostLink — Verify Your Email',
      `<div style="font-family: Arial; padding: 20px;">
        <h2 style="color: #4F46E5;">Welcome to LostLink!</h2>
        <p>Hi <b>${user.name}</b>, your verification OTP is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
        <p>This OTP will expire in <b>24 hours</b>.</p>
        <p style="color: gray;">If you did not register, please ignore this email.</p>
      </div>`
    );

    res.status(201).json({
      message: 'Registration successful! Please check your email for OTP.',
      userId: user._id
    });

  } catch (error) {
    console.log('Register error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───── VERIFY EMAIL ─────
const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: 'Please provide userId and OTP' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.isVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log('VerifyEmail error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───── LOGIN ─────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log('Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───── GET PROFILE ─────
const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const user = await User.findById(req.user.id).select('-password -verifyOtp -resetOtp');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───── FORGOT PASSWORD ─────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not registered' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save();

    // ✅ Aapka naya Beautiful Royal Blue Template
    await sendEmail(
      user.email,
      'LostLink — Password Reset OTP',
      `<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1e3a8a; font-size: 22px; margin-bottom: 10px;">Password Reset Request</h2>
        <p style="color: #4b5563; font-size: 15px;">Hi <b>${user.name}</b>,</p>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">We received a request to reset your LostLink password. Use the verification OTP below to proceed:</p>
        
        <div style="background-color: #f0f4f8; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1e3a8a; letter-spacing: 8px; font-size: 32px; margin: 0; font-family: monospace;">${otp}</h1>
        </div>
        
        <p style="color: #6b7280; font-size: 13px;">This OTP is strictly confidential and will expire in <b>15 minutes</b>.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
      </div>`
    );

    res.status(200).json({ message: 'OTP sent to your email' });

  } catch (error) {
    console.log('ForgotPassword error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───── RESET PASSWORD ─────
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    res.status(200).json({ message: 'Password reset successful! Please login.' });

  } catch (error) {
    console.log('ResetPassword error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  getProfile,
  forgotPassword,
  resetPassword
};