const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generatetoken');
const sendEmail = require('../utils/sendemail');

const register = async (req, res) => {
  try {
    const { name, email, password, rollNo, department, shift, session } = req.body;

    if (!name || !email || !password || !rollNo || !department || !shift || !session) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    let validationErrors = [];

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      validationErrors.push('Password must be at least 8 characters long and contain a mix of uppercase letters, lowercase letters, numbers, and special characters.');
    }

    const numericRollNoRegex = /^\d+$/;
    if (!numericRollNoRegex.test(rollNo)) {
      validationErrors.push('Roll Number must contain digits only (e.g., 085246).');
    }

    const sessionRegex = /^(\d{4})-(\d{4})$/;
    const match = session.match(sessionRegex);
    if (!match) {
      validationErrors.push('Session must be in YYYY-YYYY format (e.g., 2022-2026).');
    } else {
      const startYear = parseInt(match[1]);
      const endYear = parseInt(match[2]);
      if (endYear - startYear !== 4) {
        validationErrors.push('Session must be a valid 4-year degree duration (e.g., 2022-2026).');
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const existingRollNo = await User.findOne({ rollNo });
    if (existingRollNo) {
      return res.status(400).json({ message: 'This Roll Number is already registered by another student' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      rollNo,
      department,
      shift,
      session
    });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();


    await sendEmail(
      user.email,
      'LostLink — Verify Your Email',
      `<div style="font-family: Arial; padding: 20px;">
        <h2>Welcome to LostLink!</h2>
        <p>Hi <b>${user.name}</b>, your email verification OTP is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
        <p>This OTP will expire in <b>24 hours</b>.</p>
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
    user.verifyOtp = undefined;
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

    if (user.isBlocked) {
  return res.status(403).json({ message: 'Your account has been blocked. Please contact admin.' });
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

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verifyOtp -resetOtp');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not registered' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendEmail(
      user.email,
      'LostLink — Password Reset OTP',
      `<div style="font-family: Arial; padding: 20px;">
        <h2 style="color: #4F46E5;">Password Reset Request</h2>
        <p>Hi <b>${user.name}</b>, your password reset OTP is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
        <p>This OTP will expire in <b>15 minutes</b>.</p>
        <p style="color: gray;">If you did not request this, please ignore this email.</p>
      </div>`
    );

    res.status(200).json({ message: 'OTP sent to your email' });

  } catch (error) {
    console.log('ForgotPassword error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'New password must be at least 8 characters long and contain a mix of uppercase letters, lowercase letters, numbers, and special characters (e.g., @, #, $, %).' 
      });
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
