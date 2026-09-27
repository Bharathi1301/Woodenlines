const express = require('express');
const {
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, restrictTo } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/', optionalAuth, getTestimonials);
router.post('/', upload.single('photo'), createTestimonial);

router.use(protect, restrictTo('admin', 'staff'));
router.put('/:id', updateTestimonial);
router.delete('/:id', restrictTo('admin'), deleteTestimonial);

module.exports = router;
