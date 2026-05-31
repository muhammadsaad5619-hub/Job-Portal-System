const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');


// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker)

const applyForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId)

  if (!job) {
    res.status(404)
    throw new Error('Job not found')
  }

  const alreadyApplied = await Application.findOne({
    job: req.params.jobId,
    applicant: req.user._id,
  })

  if (alreadyApplied) {
    res.status(400)
    throw new Error('You have already applied for this job')
  }

  // Get cover letter from body or form
  const coverLetter = req.body.coverLetter || ''

  // Get resume URL if file was uploaded
  let resumeUrl = ''
  if (req.file) {
    resumeUrl = req.file.path
  }

  const application = await Application.create({
    job: req.params.jobId,
    applicant: req.user._id,
    coverLetter,
    resumeUrl,
  })

  await Job.findByIdAndUpdate(req.params.jobId, {
    $inc: { applicantsCount: 1 },
  })

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application,
  })
})
 
// @desc    Get all applications of logged in job seeker
// @route   GET /api/applications/myapplications
// @access  Private (Job Seeker)
 
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate('job', 'title location jobType salary deadline')
    .populate({
      path: 'job',
      populate: {
        path: 'company',
        select: 'companyName logo',
      },
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

 
// @desc    Get all applicants for a job (Employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
 
const getJobApplicants = asyncHandler(async (req, res) => {
  // Check if job belongs to this employer
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view these applications');
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('applicant', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

 
// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
 
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  // Check if application exists
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Update status
  application.status = req.body.status;
  await application.save();

  res.json({
    success: true,
    message: 'Application status updated',
    data: application,
  });
});


// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker)

const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  // Check if application exists
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check ownership
  if (application.applicant.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this application');
  }

  await application.deleteOne();

  res.json({
    success: true,
    message: 'Application deleted successfully',
  });
});

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  deleteApplication,
};