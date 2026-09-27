const express = require('express');
const { getDashboardStats } = require('../controllers/statsController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, restrictTo('admin', 'staff'), getDashboardStats);

module.exports = router;
