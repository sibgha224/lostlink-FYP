const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    default: "Govt. Post Graduate College Mandi Bahauddin",
  },
  address: {
    type: String,
    default: "Mandi Bahauddin, Punjab, Pakistan",
  },
  supportEmail: {
    type: String,
    default: "support@lostlink.com",
  },
  contactNumber: {
    type: String,
    default: "0546-123456",
  },
});

module.exports = mongoose.model("Settings", settingsSchema);