const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    default: 'Govt. Postgraduate College Mandi Bahauddin'
  },
  address: {
    type: String,
    default: 'Mandi Bahauddin, Punjab, Pakistan'
  },
  supportEmail: {
    type: String,
    default: 'support@lostlink.com'
  },
  contactNumber: {
    type: String,
    default: '0546-123456'
  },
  categories: {
    type: [String],
    default: [
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
  autoResolveEnabled: {
    type: Boolean,
    default: true
  },
  autoResolveDays: {
    type: Number,
    default: 30
  },
  autoDeleteEnabled: {
    type: Boolean,
    default: false
  },
  autoDeleteMonths: {
    type: Number,
    default: 6
  }
}, { timestamps: true });

settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);