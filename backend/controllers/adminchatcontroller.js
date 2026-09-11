const Claim = require('../models/claim');
const FoundItem = require('../models/founditem');
const { createNotification } = require('./notificationcontroller');

const markItemReturned = async (req, res) => {
  try {
    const { claimId } = req.params;

    const claim = await Claim.findById(claimId).populate('claimedBy', 'name');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved claims can be marked as returned' });
    }

    const item = await FoundItem.findById(claim.foundItem);
    if (!item) {
      return res.status(404).json({ message: 'Related item not found' });
    }

    if (item.status === 'returned') {
      return res.status(400).json({ message: 'Item already marked as returned' });
    }

    item.status = 'returned';
    await item.save();

    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    const participantIds = [claim.claimedBy._id.toString(), item.userId?.toString()].filter(Boolean);

    for (const userId of participantIds) {
      await createNotification(req, {
        recipient: userId,
        type: 'message',
        message: `"${item.itemName}" has been marked as returned. This chat is now closed.`,
        relatedItem: item._id
      });

      const sockets = onlineUsers ? onlineUsers.get(userId) : null;
      if (io && sockets && sockets.size > 0) {
        sockets.forEach(sId => io.to(sId).emit('chat_locked', { claimId }));
      }
    }

    res.status(200).json({ message: 'Item marked as returned. Chat closed.', status: item.status });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { markItemReturned };