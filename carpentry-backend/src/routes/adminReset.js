const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/reset-admin', async (req, res) => {
  try {
    const resetKey = req.headers['x-reset-key'];

    if (!resetKey || resetKey !== process.env.ADMIN_RESET_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const email = 'bharathishree1301@gmail.com';
    const newPassword = process.env.ADMIN_RESET_PASSWORD;

    if (!newPassword) {
      return res.status(500).json({
        success: false,
        message: 'Reset password is not configured.',
      });
    }

   let user = await User.findOne({ email });

if (!user) {
  user = await User.create({
    name: 'Admin',
    email,
    password: newPassword,
    role: 'admin',
  });
} else {
  user.password = newPassword;
  user.role = 'admin';
  await user.save();
}

    user.password = newPassword;
    user.role = 'admin';

    await user.save();

    res.json({
      success: true,
      message: 'Admin password reset successfully.',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Password reset failed.',
    });
  }
});

module.exports = router;