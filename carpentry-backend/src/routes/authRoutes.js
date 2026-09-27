const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, me);
router.post('/register', protect, restrictTo('admin'), register);

module.exports = router;
