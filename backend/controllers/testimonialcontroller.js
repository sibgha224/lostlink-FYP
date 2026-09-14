const Testimonial = require('../models/testimonial');

// POST /api/testimonials  { rating, message }
// A student submits (or re-submits) their review of the website.
// Re-submitting overwrites their previous review and sends it back to pending.
const submitTestimonial = async (req, res) => {
  try {
    const { rating, message } = req.body;

    if (!rating || !message || !message.trim()) {
      return res.status(400).json({ message: 'Please provide a rating and a message' });
    }
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' });
    }

    const testimonial = await Testimonial.findOneAndUpdate(
      { user: req.user._id },
      { rating: ratingNum, message: message.trim(), status: 'pending' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: 'Thanks! Your review has been submitted and will appear on the site once approved by admin.',
      testimonial
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/testimonials/my — the logged-in student's own review (or null)
const getMyTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({ user: req.user._id });
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/testimonials/published — public, shown on the Home page
const getPublishedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'published' })
      .populate('user', 'name department')
      .sort({ updatedAt: -1 })
      .limit(9);

    const formatted = testimonials
      .filter(t => t.user) // guard against a deleted user leaving an orphan review
      .map(t => ({
        id: t._id,
        name: t.user.name,
        dept: t.user.department,
        rating: t.rating,
        text: t.message
      }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/testimonials/admin — admin: every review, newest first
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({})
      .populate('user', 'name department email')
      .sort({ createdAt: -1 });

    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/testimonials/:id/publish — admin: show this review publicly
const publishTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review published', testimonial });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/testimonials/:id/unpublish — admin: pull this review off the public site
const unpublishTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: 'pending' },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review unpublished', testimonial });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/testimonials/:id — admin: remove a review entirely
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitTestimonial,
  getMyTestimonial,
  getPublishedTestimonials,
  getAllTestimonials,
  publishTestimonial,
  unpublishTestimonial,
  deleteTestimonial
};
