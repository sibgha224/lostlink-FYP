const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, trim: true, default: '' },
  image: { type: String, default: '' },
  audio: { type: String, default: '' },
  file: { type: String, default: '' },
  fileName: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);