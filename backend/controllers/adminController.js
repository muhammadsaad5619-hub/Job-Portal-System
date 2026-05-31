const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

// @desc    Get all stats for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = asyncHandler(async (req, res) => {
  // Count all documents
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const totalCompanies = await Company.countDocuments();

  // Count by role
  const totalJobSeekers = await User.countDocuments({ role: 'jobseeker' });
  const totalEmployers = await User.countDocuments({ role: 'employer' });

  // Recent users
  const recentUsers = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(5);

  // Recent jobs
  const recentJobs = await Job.find()
    .populate('company', 'companyName')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalJobs,
      totalApplications,
      totalCompanies,
      totalJobSeekers,
      totalEmployers,
      recentUsers,
      recentJobs,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Activate or deactivate user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Toggle active status
  user.isActive = req.body.isActive;
  await user.save();

  res.json({
    success: true,
    message: 'User status updated successfully',
    data: user,
  });
});

// @desc    Get all jobs for admin
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobsAdmin = asyncHandler(async (req, res) => {
  const jobs = await Job.find()
    .populate('company', 'companyName')
    .populate('postedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

// @desc    Delete job by admin
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
const deleteJobAdmin = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  await job.deleteOne();

  res.json({
    success: true,
    message: 'Job deleted successfully',
  });
});

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllJobsAdmin,
  deleteJobAdmin,
};