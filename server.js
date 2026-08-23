const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const jwt = require('jsonwebtoken'); 
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authroutes');
const adminRoutes = require('./routes/adminRoutes');
const lostItemRoutes = require('./routes/lostitemroutes');
const foundItemRoutes = require('./routes/founditemroutes');
const claimRoutes = require('./routes/claimroutes');

const notificationRoutes = require('./routes/notificationroutes');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
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

io.on('connection', (socket) => {
  onlineUsers.set(socket.userId, socket.id);

  socket.on('disconnect', () => {
    if (onlineUsers.get(socket.userId) === socket.id) {
      onlineUsers.delete(socket.userId);
    }
  });
});

app.set('socketio', io);
app.set('onlineUsers', onlineUsers);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/notifications', notificationRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'LostLink API is Running!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});