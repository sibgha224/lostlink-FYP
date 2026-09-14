const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // one review per student — resubmitting updates it instead of stacking duplicates
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'published'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
