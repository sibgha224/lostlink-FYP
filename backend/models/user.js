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
    unique: true,
    sparse: true,
    trim: true,
    required: [function () { return this.role === 'student'; }, "Roll number is required"]
  },
  academicLevel: {
    type: String,
    enum: ['BS', 'Inter', ''],
    default: '',
    required: [function () { return this.role === 'student'; }, "Academic level is required"]
  },
  department: {
    type: String,
    trim: true,
    required: [function () { return this.role === 'student'; }, "Department is required"]
  },
  shift: {
    type: String,
    required: [function () { return this.academicLevel === 'BS'; }, "Shift is required"],
    enum: ['Morning', 'Evening', '']
  },
  session: {
    type: String,
    trim: true,
    required: [function () { return this.role === 'student'; }, "Session/Batch is required"]
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'co-admin'],
    default: 'student'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
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
