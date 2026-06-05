const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  try {
    let token;

    // Header mein token check karo
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      
      token = req.headers.authorization.split(' ')[1];

      // Token verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ko req mein attach karo
      req.user = await User.findById(decoded.id).select('-password');
      next();

    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }

  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };