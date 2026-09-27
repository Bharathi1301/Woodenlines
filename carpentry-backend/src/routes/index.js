const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, status: 'ok', uptime: process.uptime() }));
router.use('/auth', require('./authRoutes'));
router.use('/admin-reset', require('./adminReset'));
router.use('/projects', require('./projectRoutes'));
router.use('/services', require('./serviceRoutes'));
router.use('/inquiries', require('./inquiryRoutes'));
router.use('/testimonials', require('./testimonialRoutes'));
router.use('/stats', require('./statsRoutes'));

module.exports = router;
