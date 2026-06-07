const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  rollNo: {
    type: String,
    required: [true, "Roll number is required"],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true
  },
  shift: {
    type: String,
    required: [true, "Shift is required"],
    enum: ['Morning', 'Evening']
  },
  session: {
    type: String,
    required: [true, "Session/Batch is required"],
    trim: true
  },
  role: {
    type: String,
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verifyOtp: {
    type: String,
    default: ''
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0
  },
  resetOtp: {
    type: String,
    default: ''
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);