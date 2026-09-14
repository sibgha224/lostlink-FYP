const Settings = require('../models/settings');

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateInstituteInfo = async (req, res) => {
  try {
    const { collegeName, address, supportEmail, contactNumber } = req.body;
    const settings = await Settings.getSingleton();

    if (collegeName !== undefined) settings.collegeName = collegeName;
    if (address !== undefined) settings.address = address;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (contactNumber !== undefined) settings.contactNumber = contactNumber;

    await settings.save();

    res.status(200).json({
      message: 'Institute information saved successfully!',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const settings = await Settings.getSingleton();

    const alreadyExists = settings.categories.some(
      (cat) => cat.toLowerCase() === trimmedName.toLowerCase()
    );

    if (alreadyExists) {
      return res.status(400).json({ message: 'This category already exists' });
    }

    settings.categories.push(trimmedName);
    await settings.save();

    res.status(200).json({
      message: 'Category added successfully!',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const settings = await Settings.getSingleton();

    settings.categories = settings.categories.filter(
      (cat) => cat.toLowerCase() !== name.toLowerCase()
    );
    await settings.save();

    res.status(200).json({
      message: 'Category removed successfully!',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAutomationRules = async (req, res) => {
  try {
    const { autoResolveEnabled, autoResolveDays, autoDeleteEnabled, autoDeleteMonths } = req.body;
    const settings = await Settings.getSingleton();

    if (autoResolveEnabled !== undefined) settings.autoResolveEnabled = autoResolveEnabled;
    if (autoResolveDays !== undefined) settings.autoResolveDays = autoResolveDays;
    if (autoDeleteEnabled !== undefined) settings.autoDeleteEnabled = autoDeleteEnabled;
    if (autoDeleteMonths !== undefined) settings.autoDeleteMonths = autoDeleteMonths;

    await settings.save();

    res.status(200).json({
      message: 'Automation rules saved successfully!',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateInstituteInfo,
  addCategory,
  removeCategory,
  updateAutomationRules
};
