const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllJobsAdmin,
  deleteJobAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All admin routes are protected and only for admin role

// @route   GET /api/admin/stats
router.get(
  '/stats',
  protect,
  authorizeRoles('admin'),
  getAdminStats
);

// @route   GET /api/admin/users
router.get(
  '/users',
  protect,
  authorizeRoles('admin'),
  getAllUsers
);

// @route   PUT /api/admin/users/:id
router.put(
  '/users/:id',
  protect,
  authorizeRoles('admin'),
  updateUserStatus
);

// @route   DELETE /api/admin/users/:id
router.delete(
  '/users/:id',
  protect,
  authorizeRoles('admin'),
  deleteUser
);

// @route   GET /api/admin/jobs
router.get(
  '/jobs',
  protect,
  authorizeRoles('admin'),
  getAllJobsAdmin
);

// @route   DELETE /api/admin/jobs/:id
router.delete(
  '/jobs/:id',
  protect,
  authorizeRoles('admin'),
  deleteJobAdmin
);

module.exports = router;