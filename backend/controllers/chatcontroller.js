const Message = require('../models/message');
const Claim = require('../models/claim');

const getClaimParticipants = async (claimId, userId, userRole = 'user') => {
  const claim = await Claim.findById(claimId).populate('foundItem');
  if (!claim) return { error: 'not_found' };

  const item = claim.foundItem;
  if (!item) return { error: 'not_found' };

  const posterId = item.userId ? item.userId.toString() : null;
  const claimerId = claim.claimedBy ? claim.claimedBy.toString() : null;
  const currentUserId = userId.toString();

  if (!posterId) {
    return { error: 'unauthorized' };
  }

  const isParticipant = (currentUserId === posterId || currentUserId === claimerId);
  const isAdmin = userRole === 'admin';

  if (!isParticipant && !isAdmin) {
    return { error: 'unauthorized' };
  }

  const isChatDisabled = item.status === 'returned';
  const otherUserId = currentUserId === posterId ? claimerId : posterId;

  return { claim, item, otherUserId, isChatDisabled, isParticipant, isAdmin };
};

const sendMessage = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { text } = req.body;
    const image = req.file ? req.file.path : '';

    if ((!text || !text.trim()) && !image) {
      return res.status(400).json({ message: 'Message text or image is required' });
    }

    const result = await getClaimParticipants(claimId, req.user._id, req.user.role);
    if (result.error === 'not_found') return res.status(404).json({ message: 'Claim not found' });
    if (result.error === 'unauthorized') return res.status(403).json({ message: 'Unauthorized' });

    if (result.isChatDisabled) {
      return res.status(400).json({ message: 'Item has been returned. Chat is disabled for this claim.' });
    }

    const message = await Message.create({
      claim: claimId,
      sender: req.user._id,
      text: text ? text.trim() : '',
      image
    });

    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    const partnerSockets = onlineUsers ? onlineUsers.get(result.otherUserId) : null;

    if (io && partnerSockets && partnerSockets.size > 0) {
      partnerSockets.forEach(socketId => io.to(socketId).emit('receive_message', message));
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { claimId } = req.params;
    const result = await getClaimParticipants(claimId, req.user._id, req.user.role);
    if (result.error === 'not_found') return res.status(404).json({ message: 'Claim not found' });
    if (result.error === 'unauthorized') return res.status(403).json({ message: 'Unauthorized' });

    const messages = await Message.find({ claim: claimId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages,
      isChatDisabled: result.isChatDisabled
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markMessagesRead = async (req, res) => {
  try {
    const { claimId } = req.params;
    const result = await getClaimParticipants(claimId, req.user._id, req.user.role);
    if (result.error === 'not_found') return res.status(404).json({ message: 'Claim not found' });
    if (result.error === 'unauthorized') return res.status(403).json({ message: 'Unauthorized' });

    const updateResult = await Message.updateMany(
      { claim: claimId, sender: result.otherUserId, isRead: false },
      { $set: { isRead: true } }
    );

    if (updateResult.modifiedCount > 0) {
      const io = req.app.get('socketio');
      const onlineUsers = req.app.get('onlineUsers');
      const senderSockets = onlineUsers ? onlineUsers.get(result.otherUserId) : null;

      if (io && senderSockets && senderSockets.size > 0) {
        senderSockets.forEach(socketId => {
          io.to(socketId).emit('messages_read', { claimId, readBy: req.user._id.toString() });
        });
      }
    }

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) return res.status(400).json({ message: 'Message text is required' });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (message.isDeleted) return res.status(400).json({ message: 'Cannot edit a deleted message' });

    const result = await getClaimParticipants(message.claim.toString(), req.user._id, req.user.role);
    if (result.error) {
      return res.status(404).json({ message: 'Associated claim not found' });
    }
    if (result.isChatDisabled) {
      return res.status(400).json({ message: 'Item returned. Cannot edit message.' });
    }

    message.text = text.trim();
    message.isEdited = true;
    await message.save();

    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    const partnerSockets = onlineUsers ? onlineUsers.get(result.otherUserId) : null;
    if (io && partnerSockets && partnerSockets.size > 0) {
      partnerSockets.forEach(socketId => io.to(socketId).emit('message_edited', message));
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (message.isDeleted) return res.status(400).json({ message: 'Message already deleted' });

    const result = await getClaimParticipants(message.claim.toString(), req.user._id, req.user.role);
    if (result.error) {
      return res.status(404).json({ message: 'Associated claim not found' });
    }
    if (result.isChatDisabled) {
      return res.status(400).json({ message: 'Item returned. Cannot delete message.' });
    }

    message.isDeleted = true;
    message.text = '';
    message.image = '';
    await message.save();

    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    const partnerSockets = onlineUsers ? onlineUsers.get(result.otherUserId) : null;
    if (io && partnerSockets && partnerSockets.size > 0) {
      partnerSockets.forEach(socketId => io.to(socketId).emit('message_deleted', { _id: message._id, claim: message.claim }));
    }

    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getClaimParticipants,
  sendMessage,
  getMessages,
  markMessagesRead,
  editMessage,
  deleteMessage
};