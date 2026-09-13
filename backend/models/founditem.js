const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Electronics',
      'Books & Notes',
      'Clothing',
      'Keys',
      'Wallet / Purse',
      'ID Card',
      'Jewelry',
      'Bag / Backpack',
      'Other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  contactName: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  preferredContact: {
    type: String,
    enum: ['email', 'phone', 'chat', ''],
    default: ''
  },
  location: {
    buildingName: { type: String, default: '' },
    floor: { type: String, default: '' },
    specificLocation: { type: String, default: '' },
    additionalDetails: { type: String, default: '' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
  },
  dateFound: {
    type: Date,
    required: true
  },
  timeFound: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'returned', 'handed_to_admin'],
    default: 'active'
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);