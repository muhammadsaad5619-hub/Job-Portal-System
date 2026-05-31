const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer)
const createJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error('Company profile not found');
  }

  const {
    title,
    description,
    requirements,
    category,
    jobType,
    location,
    salary,
    deadline,
  } = req.body;

  const job = await Job.create({
    company: company._id,
    postedBy: req.user._id,
    title,
    description,
    requirements,
    category,
    jobType,
    location,
    salary,
    deadline,
  });

  res.status(201).json({
    success: true,
    data: job,
  });
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = asyncHandler(async (req, res) => {
  const { keyword, category, jobType, location } = req.query;

  let query = { isActive: true };

  if (keyword) {
    query.title = { $regex: keyword, $options: 'i' };
  }
  if (category) {
    query.category = category;
  }
  if (jobType) {
    query.jobType = jobType;
  }
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  const jobs = await Job.find(query)
    .populate('company', 'companyName logo location')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('company', 'companyName logo location website description')
    .populate('postedBy', 'name email');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.json({
    success: true,
    data: job,
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check ownership
  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this job');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedJob,
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check ownership
  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this job');
  }

  await job.deleteOne();

  res.json({
    success: true,
    message: 'Job removed successfully',
  });
});

// @desc    Get employer jobs
// @route   GET /api/jobs/employer/myjobs
// @access  Private (Employer)
const getEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .populate('company', 'companyName logo')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs,
};