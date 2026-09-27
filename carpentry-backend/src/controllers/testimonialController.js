const Testimonial = require('../models/Testimonial');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { toPublicUrl } = require('../middleware/upload');

// Visitors see approved reviews only; admins see the moderation queue too.
const getTestimonials = asyncHandler(async (req, res) => {
  const filter = req.user ? {} : { approved: true };
  const items = await Testimonial.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

// Public submission — starts unapproved.
const createTestimonial = asyncHandler(async (req, res) => {
  const photo = req.file ? toPublicUrl(req, req.file.filename) : undefined;
  const testimonial = await Testimonial.create({ ...req.body, photo, approved: false });
  res.status(201).json({
    success: true,
    message: 'Thanks for the review — it will appear once approved.',
    data: { id: testimonial._id },
  });
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) throw ApiError.notFound('Testimonial not found');
  res.json({ success: true, data: testimonial });
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw ApiError.notFound('Testimonial not found');
  res.json({ success: true, message: 'Testimonial deleted' });
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
