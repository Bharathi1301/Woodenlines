require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const resetAdmin = async () => {
  await connectDB();

  const email = 'bharathishree1301@gmail.com';
  const newPassword = 'Bharu@1301';

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log('Admin user not found.');
    await mongoose.connection.close();
    return;
  }

  user.password = newPassword;
  user.role = 'admin';

  await user.save();

  console.log('Admin password reset successfully.');
  await mongoose.connection.close();
};

resetAdmin().catch(async (err) => {
  console.error(err);
  await mongoose.connection.close();
  process.exit(1);
});