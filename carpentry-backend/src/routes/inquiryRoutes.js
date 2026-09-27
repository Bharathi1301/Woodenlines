const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  createInquiry, getInquiries, updateInquiry, deleteInquiry,
} = require('../controllers/inquiryController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// The contact form is the one public write endpoint, so it gets its own limit.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many inquiries sent. Please try again later.' },
});

router.post('/', contactLimiter, createInquiry);

router.use(protect, restrictTo('admin', 'staff'));
router.get('/', getInquiries);
router.patch('/:id', updateInquiry);
router.delete('/:id', restrictTo('admin'), deleteInquiry);

module.exports = router;
