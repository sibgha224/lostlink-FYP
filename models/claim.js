const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  foundItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoundItem',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proofDescription: {
    type: String,
    required: true
  },
  proofImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  founderRemarks: {
    type: String,
    default: ''
  },
  decisionDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);