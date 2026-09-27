const express = require('express');
const {
  getProjects, getProject, createProject, updateProject, deleteProject,
} = require('../controllers/projectController');
const { protect, restrictTo } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/', optionalAuth, getProjects);
router.get('/:slug', optionalAuth, getProject);

router.use(protect, restrictTo('admin', 'staff'));
router.post('/', upload.array('images', 8), createProject);
router.put('/:id', upload.array('images', 8), updateProject);
router.delete('/:id', restrictTo('admin'), deleteProject);

module.exports = router;
