const LostItem = require('../models/lostitem');
const FoundItem = require('../models/founditem');

// ============================================================
// Automated Item Matching
//
// Rule-based matcher: category match + keyword overlap in the
// description + location match. Scores each lost/found pair and
// surfaces the ones above a threshold as likely matches.
// ============================================================

const STOPWORDS = new Set([
  'the', 'a', 'an', 'with', 'and', 'or', 'of', 'in', 'on', 'at', 'is', 'was',
  'it', 'its', 'to', 'for', 'my', 'i', 'this', 'that', 'near', 'has', 'had'
]);

const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
};

// Jaccard similarity between two word sets (0 to 1)
const textSimilarity = (textA, textB) => {
  const setA = new Set(tokenize(textA));
  const setB = new Set(tokenize(textB));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach((w) => {
    if (setB.has(w)) intersection += 1;
  });

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
};

const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;

  // Category match — 35%
  if (lostItem.category && foundItem.category && lostItem.category === foundItem.category) {
    score += 0.35;
  }

  // Description + item name text similarity — 45%
  const lostText = `${lostItem.itemName} ${lostItem.description} ${lostItem.color || ''} ${lostItem.brand || ''}`;
  const foundText = `${foundItem.itemName} ${foundItem.description} ${foundItem.color || ''} ${foundItem.brand || ''}`;
  score += textSimilarity(lostText, foundText) * 0.45;

  // Location match — 15%
  const lostLoc = (lostItem.location?.buildingName || '').trim().toLowerCase();
  const foundLoc = (foundItem.location?.buildingName || '').trim().toLowerCase();
  if (lostLoc && foundLoc && (lostLoc === foundLoc || lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc))) {
    score += 0.15;
  }

  // Color exact match bonus — 5%
  if (lostItem.color && foundItem.color && lostItem.color.trim().toLowerCase() === foundItem.color.trim().toLowerCase()) {
    score += 0.05;
  }

  return Math.round(score * 100); // percentage 0-100
};

const MATCH_THRESHOLD = 40; // % — only surface matches above this score

// GET /api/matching/lost/:lostItemId  → found-item candidates for one lost item
const getMatchesForLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.lostItemId);
    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    if (lostItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const candidates = await FoundItem.find({ status: 'active', isApproved: true });

    const matches = candidates
      .map((foundItem) => ({
        foundItem,
        score: calculateMatchScore(lostItem, foundItem)
      }))
      .filter((m) => m.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    res.status(200).json({ lostItemId: lostItem._id, matches });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/matching/found/:foundItemId  → lost-item candidates for one found item
const getMatchesForFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.foundItemId);
    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    if (foundItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const candidates = await LostItem.find({ status: 'active' });

    const matches = candidates
      .map((lostItem) => ({
        lostItem,
        score: calculateMatchScore(lostItem, foundItem)
      }))
      .filter((m) => m.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    res.status(200).json({ foundItemId: foundItem._id, matches });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/matching/my-matches  → best matches across all of the logged-in user's active lost items
const getMyMatches = async (req, res) => {
  try {
    const myLostItems = await LostItem.find({ userId: req.user._id, status: 'active' });
    const foundItems = await FoundItem.find({ status: 'active', isApproved: true });

    const results = [];

    myLostItems.forEach((lostItem) => {
      foundItems.forEach((foundItem) => {
        const score = calculateMatchScore(lostItem, foundItem);
        if (score >= MATCH_THRESHOLD) {
          results.push({ lostItem, foundItem, score });
        }
      });
    });

    results.sort((a, b) => b.score - a.score);

    res.status(200).json({ matches: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  calculateMatchScore,
  getMatchesForLostItem,
  getMatchesForFoundItem,
  getMyMatches
};
