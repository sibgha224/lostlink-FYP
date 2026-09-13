const FoundItem = require('../models/founditem');
const LostItem = require('../models/lostitem');
const { calculateMatchScore, MATCH_THRESHOLD } = require('./matchingcontroller');
const { createNotification, notifyAllUsersExcept, notifyAdmins } = require('./notificationcontroller');

const reportFoundItem = async (req, res) => {
  try {
    const {
      itemName, category, description, dateFound, timeFound,
      color, brand, contactName, contactEmail, contactPhone, preferredContact,
      buildingName, floor, specificLocation, additionalDetails, latitude, longitude
    } = req.body;

    if (!itemName || !category || !description || !dateFound) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const imageURL = req.file ? req.file.path : '';

    const foundItem = await FoundItem.create({
      userId: req.user._id,
      itemName,
      category,
      description,
      imageURL,
      color: color || '',
      brand: brand || '',
      contactName: contactName || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      preferredContact: preferredContact || '',
      location: {
        buildingName: buildingName || '',
        floor: floor || '',
        specificLocation: specificLocation || '',
        additionalDetails: additionalDetails || '',
        latitude: latitude || 0,
        longitude: longitude || 0
      },
      dateFound,
      timeFound: timeFound || ''
    });

    res.status(201).json({
      message: 'Found item reported successfully!',
      foundItem
    });

    try {
      await notifyAllUsersExcept(req, req.user._id, {
        type: 'new_found_item',
        message: `${req.user.name || 'A user'} reported a found item: "${foundItem.itemName}".`,
        relatedItem: foundItem._id
      });
      await notifyAdmins(req, {
        type: 'new_found_item',
        message: `${req.user.name || 'A user'} reported a found item: "${foundItem.itemName}".`,
        relatedItem: foundItem._id
      });
    } catch (broadcastError) {
      console.log('Found item broadcast notification error:', broadcastError.message);
    }

  } catch (error) {
    console.log('ReportFoundItem error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find({
      status: 'active',
      isApproved: true
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(foundItems);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFoundItemById = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id)
      .populate('userId', 'name email');

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    res.status(200).json(foundItem);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(foundItems);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    if (foundItem.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedItem = await FoundItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: 'Found item updated successfully!',
      updatedItem
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    if (foundItem.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await FoundItem.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Found item deleted successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchFoundItems = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    let query = { status: 'active', isApproved: true };

    if (keyword) {
      query.$or = [
        { itemName: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const foundItems = await FoundItem.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(foundItems);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getPendingFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find({ isApproved: false })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(foundItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const approveFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    foundItem.isApproved = true;
    await foundItem.save();

    res.status(200).json({
      message: 'Found item approved successfully!',
      foundItem
    });

    try {
      const candidates = await LostItem.find({ status: 'active' });
      for (const lostItem of candidates) {
        const score = calculateMatchScore(lostItem, foundItem);
        if (score >= MATCH_THRESHOLD) {
          await createNotification(req, {
            recipient: lostItem.userId,
            type: 'item_matched',
            message: `A found item "${foundItem.itemName}" might match your lost "${lostItem.itemName}".`,
            relatedItem: foundItem._id
          });
        }
      }
    } catch (matchError) {
      console.log('Match notification error:', matchError.message);
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  reportFoundItem,
  getAllFoundItems,
  getFoundItemById,
  getMyFoundItems,
  updateFoundItem,
  deleteFoundItem,
  searchFoundItems,
  approveFoundItem,
  getPendingFoundItems
};
