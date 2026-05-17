const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected!'))
.catch((err) => console.log('Error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('LostLink Backend Running!');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});