const FoundItem = require('../models/founditem'); 
const LostItem = require('../models/lostitem');

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
        latitude: latitude ? Number(latitude) : 0,
        longitude: longitude ? Number(longitude) : 0
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
    const foundItems = await FoundItem.find({ status: 'active' })
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
    let foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    if (foundItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { itemName, category, description, buildingName, latitude, longitude, dateFound, status } = req.body;
    
    let updateData = {};
    if (itemName) updateData.itemName = itemName;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (dateFound) updateData.dateFound = dateFound;
    if (status) updateData.status = status;

    if (req.file) {
      updateData.imageURL = req.file.path;
    }

    if (buildingName || latitude || longitude) {
      updateData.location = {
        buildingName: buildingName !== undefined ? buildingName : foundItem.location.buildingName,
        latitude: latitude !== undefined ? Number(latitude) : foundItem.location.latitude,
        longitude: longitude !== undefined ? Number(longitude) : foundItem.location.longitude
      };
    }

    const updatedItem = await FoundItem.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
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

// Smart Search & Filtering 
const searchFoundItems = async (req, res) => {
  try {
    const { keyword, category, type, buildingName, date, sortBy } = req.query;

    let mongoQuery = { status: 'active' };

    if (keyword) {
      mongoQuery.$or = [
        { itemName: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      mongoQuery.category = category;
    }

    if (buildingName) {
      mongoQuery['location.buildingName'] = { $regex:buildingName, $options: 'i' };
    }
    
    if (date) {
      const [year, month, day] = date.split('-').map(Number);

      const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

      mongoQuery.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    let results = [];

    if (type === 'lost') {
      results = await LostItem.find(mongoQuery)
        .populate('userId', 'name email')
        .sort(sortOption);
    } else if (type === 'found') {
      results = await FoundItem.find(mongoQuery)
        .populate('userId', 'name email')
        .sort(sortOption);
    } else {
      const foundData = await FoundItem.find(mongoQuery).populate('userId', 'name email');
      const lostData = await LostItem.find(mongoQuery).populate('userId', 'name email');
      
      results = [...foundData, ...lostData];

      if (sortBy === 'oldest') {
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
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
  searchFoundItems
};