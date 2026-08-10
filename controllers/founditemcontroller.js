const FoundItem = require('../models/founditem'); 
const reportFoundItem = async (req, res) => {
  try {
    const { itemName, category, description, buildingName, latitude, longitude, dateFound } = req.body;

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
      location: {
        buildingName: buildingName || '',
        latitude: latitude || 0,
        longitude: longitude || 0
      },
      dateFound
    });

    res.status(201).json({
      message: 'Found item reported successfully!',
      foundItem
    });

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

    if (foundItem.userId.toString() !== req.user._id.toString()) {
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

    if (foundItem.userId.toString() !== req.user._id.toString()) {
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
  approveFoundItem
};