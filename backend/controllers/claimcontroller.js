const Claim = require('../models/claim');
const FoundItem = require('../models/founditem');
const sendEmail = require('../utils/sendemail');
const { createNotification } = require('./notificationcontroller');

const submitClaim = async (req, res) => {
  try {
    const { foundItemId, proofDescription } = req.body;

    if (!foundItemId || !proofDescription) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const item = await FoundItem.findById(foundItemId);
    if (!item) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    if (!item.userId || item.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot claim an item you posted yourself!' });
    }

    if (item.status !== 'active') {
      return res.status(400).json({ message: 'This item is no longer available for claims' });
    }

    const existingClaim = await Claim.findOne({
      foundItem: foundItemId,
      claimedBy: req.user._id
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'You already submitted a claim for this item!' });
    }

    const proofImage = req.file ? req.file.path : '';

    const claim = await Claim.create({
      foundItem: foundItemId,
      claimedBy: req.user._id,
      proofDescription,
      proofImage
    });

    if (item.userId) {
      await createNotification(req, {
        recipient: item.userId,
        type: 'claim_submitted',
        message: `${req.user.name || 'A user'} has submitted a claim on your item "${item.itemName || 'Found Item'}".`,
        relatedItem: item._id
      });
    }

    res.status(201).json({
      message: 'Claim submitted successfully!',
      claim
    });

  } catch (error) {
    console.log('SubmitClaim error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getClaimsByItem = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.foundItemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.userId || item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Only the item founder can view claims' });
    }

    const claims = await Claim.find({ foundItem: req.params.foundItemId })
      .populate('claimedBy', 'name email rollNo')
      .sort({ createdAt: -1 });

    res.status(200).json(claims);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateClaimStatus = async (req, res) => {
  try {
    const { status, founderRemarks } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'approved' or 'rejected'"
      });
    }

    const claim = await Claim.findById(req.params.claimId).populate('claimedBy', 'name email');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    const item = await FoundItem.findById(claim.foundItem);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Related item not found'
      });
    }

    // Authorization 
    if (!item.userId || item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the item founder can update claim status'
      });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This claim has already been ${claim.status}`
      });
    }

    claim.status = status;
    claim.founderRemarks = founderRemarks;
    claim.decisionDate = new Date();
    await claim.save();

    if (status === 'approved') {
      await FoundItem.findByIdAndUpdate(
        claim.foundItem,
        { status: 'claimed' }
      );

      await Claim.updateMany(
        {
          foundItem: claim.foundItem,
          _id: { $ne: claim._id },
          status: 'pending'
        },
        {
          status: 'rejected',
          founderRemarks: 'Another claim has been approved.'
        }
      );
    }

    // Claimer ko decision ki notification
    if (claim.claimedBy) {
      await createNotification(req, {
        recipient: claim.claimedBy._id,
        type: status === 'approved' ? 'claim_approved' : 'claim_rejected',
        message: `Your claim for "${item.itemName || 'Item'}" has been ${status}.`,
        relatedItem: item._id
      });
    }

    if (claim.claimedBy && claim.claimedBy.email) {
      try {
        const subject = status === 'approved'
          ? 'Your claim has been accepted - LostLink'
          : 'Your claim has been rejected - LostLink';

        const htmlContent = status === 'approved'
          ? `<p>Hi ${claim.claimedBy.name},</p>
             <p>Good news! Your claim on the item has been <strong>accepted</strong> by the finder.</p>
             ${founderRemarks ? `<p>Remarks: ${founderRemarks}</p>` : ''}
             <p>Please coordinate with the finder to collect your item.</p>
             <p>- LostLink Team</p>`
          : `<p>Hi ${claim.claimedBy.name},</p>
             <p>Your claim on the item has been <strong>rejected</strong> by the finder.</p>
             ${founderRemarks ? `<p>Remarks: ${founderRemarks}</p>` : ''}
             <p>- LostLink Team</p>`;

        await sendEmail(claim.claimedBy.email, subject, htmlContent);
      } catch (emailError) {
        console.log('Claim notification email failed:', emailError.message);
      }
    }

    res.json({
      success: true,
      message: 'Claim updated successfully.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user._id })
      .populate({
        path: 'foundItem',
        select: 'itemName status imageURL userId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin-only: every claim platform-wide, for oversight. Approve/reject stays
// with the finder (peer-to-peer verification) — admins can only monitor here
// and mark an item as returned once the finder has approved a claim.
const getAllClaimsAdmin = async (req, res) => {
  try {
    const claims = await Claim.find({})
      .populate('claimedBy', 'name email rollNo')
      .populate({
        path: 'foundItem',
        select: 'itemName status imageURL userId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitClaim,
  getClaimsByItem,
  updateClaimStatus,
  getMyClaims,
  getAllClaimsAdmin
};