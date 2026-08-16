const LostItem = require('../models/lostitem');

const reportLostItem = async (req, res) => {
  try {
    const { itemName, category, description, buildingName, latitude, longitude, dateLost } = req.body;

    if (!itemName || !category || !description || !dateLost) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const imageURL = req.file ? req.file.path : '';

    const lostItem = await LostItem.create({
      userId: req.user._id,
      itemName,
      category,
      description,
      imageURL,
      location: {
        buildingName: buildingName || '',
        latitude: latitude ? Number(latitude) : 0,
        longitude: longitude ? Number(longitude) : 0
      },
      dateLost
    });

    res.status(201).json({
      message: 'Lost item reported successfully!',
      lostItem
    });

  } catch (error) {
    console.log('ReportLostItem error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getAllLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find({ status: 'active' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(lostItems);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLostItemById = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id)
      .populate('userId', 'name email');

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    res.status(200).json(lostItem);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(lostItems);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateLostItem = async (req, res) => {
  try {
    let lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    if (lostItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { itemName, category, description, buildingName, latitude, longitude, dateLost, status } = req.body;
    
    let updateData = {};
    if (itemName) updateData.itemName = itemName;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (dateLost) updateData.dateLost = dateLost;
    if (status) updateData.status = status;

    if (req.file) {
      updateData.imageURL = req.file.path;
    }

    if (buildingName || latitude || longitude) {
      updateData.location = {
        buildingName: buildingName !== undefined ? buildingName : lostItem.location.buildingName,
        latitude: latitude !== undefined ? Number(latitude) : lostItem.location.latitude,
        longitude: longitude !== undefined ? Number(longitude) : lostItem.location.longitude
      };
    }

    const updatedItem = await LostItem.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Lost item updated successfully!',
      updatedItem
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    if (lostItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await LostItem.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Lost item deleted successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchLostItems = async (req, res) => {
  try {
    const { keyword, category, buildingName, date, sortBy } = req.query;

    let query = { status: 'active' };

    // Keyword Search
    if (keyword) {
      query.$or = [
        { itemName: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (buildingName) {
      query['location.buildingName'] = { $regex: buildingName, $options: 'i' };
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const lostItems = await LostItem.find(query)
      .populate('userId', 'name email')
      .sort(sortOption);

    res.status(200).json(lostItems);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  reportLostItem,
  getAllLostItems,
  getLostItemById,
  getMyLostItems,
  updateLostItem,
  deleteLostItem,
  searchLostItems
};