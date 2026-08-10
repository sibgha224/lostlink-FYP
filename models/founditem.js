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
      'Books',
      'Clothing',
      'Accessories',
      'Documents',
      'Keys',
      'Wallet',
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
  location: {
    buildingName: { type: String, default: '' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
  },
  dateFound: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'returned'],
    default: 'active'
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);