const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requesterName: {
    type: String,
    default: ''
  },
  requesterEmail: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['lost_followup', 'found_handover', 'unblock', 'general_issue'],
    required: true
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId
  },
  itemModel: {
    type: String,
    enum: ['LostItem', 'FoundItem']
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'closed'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);