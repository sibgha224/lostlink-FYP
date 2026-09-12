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
      if (!user.academicLevel) user.academicLevel = 'BS';
      if (!user.department) user.department = 'Administration';
      if (!user.shift) user.shift = 'Morning';
      if (!user.session) user.session = '2020-2024';
      if (!user.rollNo) user.rollNo = `ADMIN-${Date.now().toString().slice(-6)}`;
      if (passwordArg) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(passwordArg, salt);
      }
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
        academicLevel: 'BS',
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
