// One-time script to create (or promote) an admin account.
// The signup form only ever creates role: 'student' accounts, and there is
// no in-app way to become an admin — this script is the missing piece.
//
// Usage (from the backend/ folder, after setting up your .env):
//   node scripts/seedAdmin.js "Admin Name" admin@college.edu.pk "StrongPass123!"
//
// If a user with that email already exists, it is promoted to role:'admin',
// verified, and unblocked instead of creating a duplicate account.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/user');

const run = async () => {
  const [, , nameArg, emailArg, passwordArg] = process.argv;

  const name = nameArg || 'Admin';
  const email = emailArg || 'admin@college.edu.pk';
  const password = passwordArg || 'Admin@1234';

  await connectDB();

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      user.isVerified = true;
      user.isBlocked = false;
      await user.save();
      console.log(`Existing user "${email}" promoted to admin.`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        rollNo: `ADMIN-${Date.now().toString().slice(-6)}`,
        department: 'Administration',
        shift: 'Morning',
        session: '2020-2024',
        role: 'admin',
        isVerified: true,
      });
      console.log(`Admin account created.\n  Email: ${email}\n  Password: ${password}`);
    }
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
  } finally {
    await mongoose.connection.close();
  }
};

run();
