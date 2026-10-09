const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  claim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: '',
    trim: true
  }
}, { timestamps: true });

reviewSchema.index({ claim: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
