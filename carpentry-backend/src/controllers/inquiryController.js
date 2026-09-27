const Inquiry = require('../models/Inquiry');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/inquiries — public contact form / chatbot endpoint.
const createInquiry = asyncHandler(async (req, res) => {
  const { name, phone, email, serviceType, budget, message, source } = req.body;
  const inquiry = await Inquiry.create({ name, phone, email, serviceType, budget, message, source });
  res.status(201).json({
    success: true,
    message: 'Thanks — we will get back to you shortly.',
    data: { id: inquiry._id },
  });
});

// GET /api/inquiries?status=&page=&limit=  (admin)
const getInquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const filter = status ? { status } : {};

  const [items, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Inquiry.countDocuments(filter),
  ]);

  res.json({ success: true, data: items, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// PATCH /api/inquiries/:id  (admin) — status changes and internal notes.
const updateInquiry = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(notes !== undefined && { notes }) },
    { new: true, runValidators: true }
  );
  if (!inquiry) throw ApiError.notFound('Inquiry not found');
  res.json({ success: true, data: inquiry });
});

const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) throw ApiError.notFound('Inquiry not found');
  res.json({ success: true, message: 'Inquiry deleted' });
});

module.exports = { createInquiry, getInquiries, updateInquiry, deleteInquiry };
