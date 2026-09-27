const express = require('express');
const {
  getServices, createService, updateService, deleteService,
} = require('../controllers/serviceController');
const { protect, restrictTo } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.get('/', optionalAuth, getServices);

router.use(protect, restrictTo('admin', 'staff'));
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', restrictTo('admin'), deleteService);

module.exports = router;
