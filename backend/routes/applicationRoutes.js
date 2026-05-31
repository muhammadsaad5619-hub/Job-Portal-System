const express = require('express')
const router = express.Router()
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')
const { authorizeRoles } = require('../middleware/roleMiddleware')
const upload = require('../middleware/uploadMiddleware')

// @route   POST /api/applications/:jobId
router.post(
  '/:jobId',
  protect,
  authorizeRoles('jobseeker'),
  upload.single('resume'),
  applyForJob
)

// @route   GET /api/applications/myapplications
router.get(
  '/myapplications',
  protect,
  authorizeRoles('jobseeker'),
  getMyApplications
)

// @route   GET /api/applications/job/:jobId
router.get(
  '/job/:jobId',
  protect,
  authorizeRoles('employer'),
  getJobApplicants
)

// @route   PUT /api/applications/:id/status
router.put(
  '/:id/status',
  protect,
  authorizeRoles('employer'),
  updateApplicationStatus
)

// @route   DELETE /api/applications/:id
router.delete(
  '/:id',
  protect,
  authorizeRoles('jobseeker'),
  deleteApplication
)

module.exports = router