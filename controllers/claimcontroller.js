const Claim = require('../models/claim');
const FoundItem = require('../models/founditem'); 

const submitClaim = async (req, res) => {
  try {
    const { foundItemId, proofDescription } = req.body;

    if (!foundItemId || !proofDescription) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const proofImage = req.file ? req.file.path : '';

    const existingClaim = await Claim.findOne({
      foundItem: foundItemId,
      claimedBy: req.user._id
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'You already submitted a claim for this item!' });
    }

    const claim = await Claim.create({
      foundItem: foundItemId,
      claimedBy: req.user._id,
      proofDescription,
      proofImage
    });

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

    const claim = await Claim.findById(req.params.claimId);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
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

module.exports = {
  submitClaim,
  getClaimsByItem,
  updateClaimStatus
};