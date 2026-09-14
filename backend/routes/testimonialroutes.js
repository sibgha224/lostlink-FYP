const express = require('express');
const router = express.Router();
const {
  submitTestimonial,
  getMyTestimonial,
  getPublishedTestimonials,
  getAllTestimonials,
  publishTestimonial,
  unpublishTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialcontroller');

const { protect } = require('../middleware/authmiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/published', getPublishedTestimonials); // public — Home page reads this

router.post('/', protect, submitTestimonial);
router.get('/my', protect, getMyTestimonial);

router.get('/admin', protect, adminOnly, getAllTestimonials);
router.put('/:id/publish', protect, adminOnly, publishTestimonial);
router.put('/:id/unpublish', protect, adminOnly, unpublishTestimonial);
router.delete('/:id', protect, adminOnly, deleteTestimonial);

module.exports = router;
