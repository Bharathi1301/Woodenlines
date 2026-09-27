const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { toPublicUrl } = require('../middleware/upload');

// GET /api/projects?category=&featured=&page=&limit=&search=
const getProjects = asyncHandler(async (req, res) => {
  const { category, featured, search } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 9);

  const filter = {};
  // Visitors only ever see published work; the admin dashboard sees everything.
  if (!req.user) filter.published = true;
  if (category) filter.category = category;
  if (featured) filter.featured = featured === 'true';
  if (search) filter.$or = [
    { title: new RegExp(search, 'i') },
    { description: new RegExp(search, 'i') },
  ];

  const [items, total] = await Promise.all([
    Project.find(filter).sort({ featured: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Project.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// GET /api/projects/:slug
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project || (!project.published && !req.user)) throw ApiError.notFound('Project not found');
  res.json({ success: true, data: project });
});

// POST /api/projects  (multipart/form-data, field name: images)
const createProject = asyncHandler(async (req, res) => {
  const images = (req.files || []).map((f) => toPublicUrl(req, f.filename));
  const project = await Project.create({
    ...req.body,
    images,
    coverImage: images[0] || req.body.coverImage,
  });
  res.status(201).json({ success: true, data: project });
});

// PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  const newImages = (req.files || []).map((f) => toPublicUrl(req, f.filename));
  Object.assign(project, req.body);
  if (newImages.length) project.images = [...project.images, ...newImages];
  if (!project.coverImage) project.coverImage = project.images[0];

  await project.save();
  res.json({ success: true, data: project });
});

// DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');
  res.json({ success: true, message: 'Project deleted' });
});

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
