const Notification = require('../models/notification');

const createNotification = async (req, { recipient, type, message, relatedItem }) => {
  try {

    const notification = await Notification.create({ recipient, type, message, relatedItem });

    if (req && req.app) {
      const io = req.app.get('socketio');
      const onlineUsers = req.app.get('onlineUsers');
      const recipientSockets = onlineUsers.get(recipient.toString());

      if (io && recipientSockets && recipientSockets.size > 0) {
        recipientSockets.forEach(socketId => io.to(socketId).emit('new_notification', notification));
      }
    }

    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error.message);
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notifications', error: error.message });
  }
};

module.exports = { createNotification, getMyNotifications, markAsRead, markAllAsRead };