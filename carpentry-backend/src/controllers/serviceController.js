const Service = require('../models/Service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getServices = asyncHandler(async (req, res) => {
  const filter = req.user ? {} : { active: true };
  const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: services });
});

const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) throw ApiError.notFound('Service not found');
  res.json({ success: true, data: service });
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw ApiError.notFound('Service not found');
  res.json({ success: true, message: 'Service deleted' });
});

module.exports = { getServices, createService, updateService, deleteService };
