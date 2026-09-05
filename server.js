const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const jwt = require('jsonwebtoken'); 
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const Claim = require('./models/claim');
const FoundItem = require('./models/founditem');
const { getClaimParticipants } = require('./controllers/chatcontroller');

const authRoutes = require('./routes/authroutes');
const adminRoutes = require('./routes/adminRoutes');
const lostItemRoutes = require('./routes/lostitemroutes');
const foundItemRoutes = require('./routes/founditemroutes');
const claimRoutes = require('./routes/claimroutes');
const notificationRoutes = require('./routes/notificationroutes');
const chatRoutes = require('./routes/chatroutes');
const adminChatRoutes = require('./routes/adminchatroutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', 
    methods: ['GET', 'POST']
  }
});

const onlineUsers = new Map(); 

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Invalid or expired token'));
  }
});

const getChatPartnerIds = async (userId) => {
  const partnerIds = new Set();

  const myClaims = await Claim.find({ claimedBy: userId }).populate('foundItem', 'userId');
  myClaims.forEach(c => {
    if (c.foundItem && c.foundItem.userId) {
      partnerIds.add(c.foundItem.userId.toString());
    }
  });

  const myItems = await FoundItem.find({ userId }).select('_id');
  const itemIds = myItems.map(i => i._id);
  const claimsOnMyItems = await Claim.find({ foundItem: { $in: itemIds } }).select('claimedBy');
  claimsOnMyItems.forEach(c => partnerIds.add(c.claimedBy.toString()));

  return partnerIds;
};

io.on('connection', async (socket) => {
  if (!onlineUsers.has(socket.userId)) {
    onlineUsers.set(socket.userId, new Set());
  }
  onlineUsers.get(socket.userId).add(socket.id);

  try {
    const partnerIds = await getChatPartnerIds(socket.userId);
    partnerIds.forEach(partnerId => {
      const partnerSockets = onlineUsers.get(partnerId);
      if (partnerSockets) {
        partnerSockets.forEach(sId => io.to(sId).emit('user_online', { userId: socket.userId }));
      }
    });
  } catch (error) {
    console.error('Online status broadcast failed:', error.message);
  }

  socket.on('typing', async ({ claimId }) => {
    const result = await getClaimParticipants(claimId, socket.userId);
    if (result.error) return;

    const partnerSockets = onlineUsers.get(result.otherUserId);
    if (partnerSockets) {
      partnerSockets.forEach(sId => io.to(sId).emit('typing', { claimId, userId: socket.userId }));
    }
  });

  socket.on('stop_typing', async ({ claimId }) => {
    const result = await getClaimParticipants(claimId, socket.userId);
    if (result.error) return;

    const partnerSockets = onlineUsers.get(result.otherUserId);
    if (partnerSockets) {
      partnerSockets.forEach(sId => io.to(sId).emit('stop_typing', { claimId, userId: socket.userId }));
    }
  });

  socket.on('disconnect', async () => {
    const userSockets = onlineUsers.get(socket.userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(socket.userId);

        try {
          const partnerIds = await getChatPartnerIds(socket.userId);
          partnerIds.forEach(partnerId => {
            const partnerSockets = onlineUsers.get(partnerId);
            if (partnerSockets) {
              partnerSockets.forEach(sId => io.to(sId).emit('user_offline', { userId: socket.userId }));
            }
          });
        } catch (error) {
          console.error('Offline status broadcast failed:', error.message);
        }
      }
    }
  });
});

app.set('socketio', io);
app.set('onlineUsers', onlineUsers);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/notifications', notificationRoutes); 
app.use('/api/chat', chatRoutes);
app.use('/api/admin/chat', adminChatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'LostLink API is Running!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});