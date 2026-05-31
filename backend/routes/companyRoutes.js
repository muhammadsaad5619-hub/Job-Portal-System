const express = require('express');
const router = express.Router();
const {
  getCompanyProfile,
  updateCompanyProfile,
  getAllCompanies,
  getCompanyById,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// @route   GET /api/company
router.get('/', getAllCompanies);

// @route   GET /api/company/profile
router.get(
  '/profile',
  protect,
  authorizeRoles('employer'),
  getCompanyProfile
);

// @route   PUT /api/company/profile
router.put(
  '/profile',
  protect,
  authorizeRoles('employer'),
  updateCompanyProfile
);

// @route   GET /api/company/:id
router.get('/:id', getCompanyById);

module.exports = router;