const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  shift: {
    type: String,
    enum: ['Morning', 'Evening']
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