const Review = require('../models/review');
const Claim = require('../models/claim');
const FoundItem = require('../models/founditem');
const { createNotification } = require('./notificationcontroller');

// Works out who the "other side" of a claim is for the person submitting
// the review — the finder rates the claimant, the claimant rates the finder.
const getOtherPartyId = async (claim, currentUserId) => {
  const item = await FoundItem.findById(claim.foundItem).select('userId');
  if (!item) return null;

  const finderId = item.userId.toString();
  const claimantId = claim.claimedBy.toString();

  if (currentUserId === finderId) return claimantId;
  if (currentUserId === claimantId) return finderId;
  return null;
};

// POST /api/reviews  { claimId, rating, comment }
const submitReview = async (req, res) => {
  try {
    const { claimId, rating, comment } = req.body;

    if (!claimId || !rating) {
      return res.status(400).json({ message: 'Please provide claimId and rating' });
    }
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' });
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    if (claim.status !== 'approved') {
      return res.status(400).json({ message: 'You can only leave a review once this claim has been approved' });
    }

    const reviewerId = req.user._id.toString();
    const reviewedUserId = await getOtherPartyId(claim, reviewerId);
    if (!reviewedUserId) {
      return res.status(403).json({ message: 'You are not part of this exchange' });
    }

    const existing = await Review.findOne({ claim: claimId, reviewer: reviewerId });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this exchange' });
    }

    const review = await Review.create({
      claim: claimId,
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
      rating: ratingNum,
      comment: comment || ''
    });

    await createNotification(req, {
      recipient: reviewedUserId,
      type: 'message',
      message: `${req.user.name || 'A student'} left you a ${ratingNum}-star review.`,
      relatedItem: claim.foundItem
    });

    res.status(201).json({ message: 'Review submitted!', review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this exchange' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/reviews/user/:userId  — reviews someone has received, plus their average
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });

    const average = reviews.length
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    res.status(200).json({ average, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/reviews/my-reviews — claim ids the logged-in user has already reviewed
const getMyGivenReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id }).select('claim rating comment');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitReview, getUserReviews, getMyGivenReviews };
