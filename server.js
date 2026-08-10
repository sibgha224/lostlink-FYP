const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authroutes');
const adminRoutes = require('./routes/adminRoutes');
const lostItemRoutes = require('./routes/lostitemroutes');
const foundItemRoutes = require('./routes/founditemroutes');
const claimRoutes = require('./routes/claimroutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/claims', claimRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'LostLink API is Running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
