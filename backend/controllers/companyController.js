const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');

// @desc    Get company profile
// @route   GET /api/company/profile
// @access  Private (Employer)
const getCompanyProfile = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error('Company profile not found');
  }

  res.json({
    success: true,
    data: company,
  });
});

// @desc    Update company profile
// @route   PUT /api/company/profile
// @access  Private (Employer)
const updateCompanyProfile = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error('Company profile not found');
  }

  const {
    companyName,
    description,
    location,
    website,
    industry,
    companySize,
  } = req.body;

  // Update fields
  company.companyName = companyName || company.companyName;
  company.description = description || company.description;
  company.location = location || company.location;
  company.website = website || company.website;
  company.industry = industry || company.industry;
  company.companySize = companySize || company.companySize;

  await company.save();

  res.json({
    success: true,
    message: 'Company profile updated successfully',
    data: company,
  });
});

// @desc    Get all companies
// @route   GET /api/company
// @access  Public
const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: companies.length,
    data: companies,
  });
});

// @desc    Get single company by id
// @route   GET /api/company/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)
    .populate('user', 'name email');

  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  res.json({
    success: true,
    data: company,
  });
});

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  getAllCompanies,
  getCompanyById,
};