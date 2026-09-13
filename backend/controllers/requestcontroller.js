const Request = require('../models/request');
const ReportMessage = require('../models/reportmessage');
const User = require('../models/user');
const LostItem = require('../models/lostitem');
const FoundItem = require('../models/founditem');
const { createNotification, notifyAdmins } = require('./notificationcontroller');

const submitLostFollowup = async (req, res) => {
  try {
    const { itemId, message } = req.body;
    if (!itemId || !message) {
      return res.status(400).json({ message: 'Please provide the item and a message' });
    }

    const item = await LostItem.findOne({ _id: itemId, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    const existing = await Request.findOne({ relatedItem: itemId, type: 'lost_followup', status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'A follow-up request for this item is already pending' });
    }

    const request = await Request.create({
      requester: req.user._id,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      type: 'lost_followup',
      relatedItem: item._id,
      itemModel: 'LostItem',
      message
    });

    await notifyAdmins(req, {
      type: 'message',
      message: `${req.user.name} sent a follow-up request for their lost item "${item.itemName}" (30+ days pending).`,
      relatedItem: item._id
    });

    res.status(201).json({ message: 'Follow-up request sent to admin', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitFoundHandover = async (req, res) => {
  try {
    const { itemId, message } = req.body;
    if (!itemId || !message) {
      return res.status(400).json({ message: 'Please provide the item and a message' });
    }

    const item = await FoundItem.findOne({ _id: itemId, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    const existing = await Request.findOne({ relatedItem: itemId, type: 'found_handover', status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'A hand-over request for this item is already pending' });
    }

    const request = await Request.create({
      requester: req.user._id,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      type: 'found_handover',
      relatedItem: item._id,
      itemModel: 'FoundItem',
      message
    });

    await notifyAdmins(req, {
      type: 'message',
      message: `${req.user.name} wants to hand over the found item "${item.itemName}" to the Principal Office.`,
      relatedItem: item._id
    });

    res.status(201).json({ message: 'Hand-over request sent to admin', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitUnblockRequest = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ message: 'Please provide your email and a message' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }
    if (!user.isBlocked) {
      return res.status(400).json({ message: 'This account is not blocked' });
    }

    const existing = await Request.findOne({ requesterEmail: user.email, type: 'unblock', status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'An unblock request is already pending for this account' });
    }

    const request = await Request.create({
      requester: user._id,
      requesterName: user.name,
      requesterEmail: user.email,
      type: 'unblock',
      message
    });

    await notifyAdmins(req, {
      type: 'message',
      message: `${user.name} (${user.email}) requested to be unblocked.`,
      relatedItem: user._id
    });

    res.status(201).json({ message: 'Your unblock request has been sent to the admin', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitGeneralIssue = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Please describe your issue' });
    }

    const request = await Request.create({
      requester: req.user._id,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      type: 'general_issue',
      message: message.trim()
    });

    await ReportMessage.create({
      request: request._id,
      sender: req.user._id,
      senderRole: 'student',
      text: message.trim()
    });

    await notifyAdmins(req, {
      type: 'message',
      message: `${req.user.name} reported an issue: "${message.trim().slice(0, 80)}"`,
      relatedItem: request._id
    });

    res.status(201).json({ message: 'Your issue has been reported to the admin', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('requester', 'name email rollNo')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resolveRequest = async (req, res) => {
  try {
    const { action, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(action)) {
      return res.status(400).json({ message: 'Action must be approved or rejected' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been resolved' });
    }

    if (action === 'approved') {
      if (request.type === 'unblock') {
        await User.findByIdAndUpdate(request.requester, { isBlocked: false });
      } else if (request.type === 'found_handover') {
        await FoundItem.findByIdAndUpdate(request.relatedItem, { status: 'handed_to_admin' });
      }
    }

    request.status = action;
    request.adminNote = adminNote || '';
    await request.save();

    if (request.requester) {
      const labels = {
        lost_followup: 'your lost item follow-up request',
        found_handover: 'your hand-over request',
        unblock: 'your unblock request'
      };
      await createNotification(req, {
        recipient: request.requester,
        type: 'message',
        message: `Admin has ${action} ${labels[request.type] || 'your request'}.${adminNote ? ` Note: ${adminNote}` : ''}`,
        relatedItem: request.relatedItem || undefined
      });
    }

    res.status(200).json({ message: `Request ${action}`, request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getReportMessages = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request || request.type !== 'general_issue') {
      return res.status(404).json({ message: 'Report not found' });
    }

    const isOwner = request.requester && request.requester.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const messages = await ReportMessage.find({ request: request._id })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    res.status(200).json({ messages, status: request.status });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendReportMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const request = await Request.findById(req.params.id);
    if (!request || request.type !== 'general_issue') {
      return res.status(404).json({ message: 'Report not found' });
    }

    const isOwner = request.requester && request.requester.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status === 'closed') {
      return res.status(400).json({ message: 'This chat has been closed by admin' });
    }

    const reportMessage = await ReportMessage.create({
      request: request._id,
      sender: req.user._id,
      senderRole: isAdmin ? 'admin' : 'student',
      text: text.trim()
    });
    await reportMessage.populate('sender', 'name');

    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');

    if (isAdmin) {
      if (request.requester) {
        await createNotification(req, {
          recipient: request.requester,
          type: 'report_reply',
          message: `Admin replied to your reported issue.`,
          relatedItem: request._id
        });
      }
    } else {
      await notifyAdmins(req, {
        type: 'message',
        message: `${req.user.name} sent a new message about their reported issue.`,
        relatedItem: request._id
      });
    }

    if (io && onlineUsers) {
      const senderId = req.user._id.toString();
      const targetIds = new Set();
      if (request.requester) targetIds.add(request.requester.toString());
      const admins = await User.find({ role: 'admin' }).select('_id');
      admins.forEach(a => targetIds.add(a._id.toString()));
      targetIds.delete(senderId);
      targetIds.forEach(id => {
        const sockets = onlineUsers.get(id);
        if (sockets && sockets.size > 0) {
          sockets.forEach(socketId => io.to(socketId).emit('report_message', { requestId: request._id.toString(), message: reportMessage }));
        }
      });
    }

    res.status(201).json(reportMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const closeReport = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request || request.type !== 'general_issue') {
      return res.status(404).json({ message: 'Report not found' });
    }
    if (request.status === 'closed') {
      return res.status(400).json({ message: 'This report is already closed' });
    }

    request.status = 'closed';
    await request.save();

    if (request.requester) {
      await createNotification(req, {
        recipient: request.requester,
        type: 'report_reply',
        message: 'Admin has closed your reported issue chat.',
        relatedItem: request._id
      });
    }

    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    if (io && onlineUsers && request.requester) {
      const sockets = onlineUsers.get(request.requester.toString());
      if (sockets && sockets.size > 0) {
        sockets.forEach(socketId => io.to(socketId).emit('report_closed', { requestId: request._id.toString() }));
      }
    }

    res.status(200).json({ message: 'Report closed', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitLostFollowup,
  submitFoundHandover,
  submitUnblockRequest,
  submitGeneralIssue,
  getMyRequests,
  getAllRequests,
  resolveRequest,
  getReportMessages,
  sendReportMessage,
  closeReport
};