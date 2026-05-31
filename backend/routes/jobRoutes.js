const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// @route   GET /api/jobs
router.get('/', getAllJobs);

// @route   POST /api/jobs
router.post('/', protect, authorizeRoles('employer'), createJob);

// @route   GET /api/jobs/employer/myjobs
router.get('/employer/myjobs', protect, authorizeRoles('employer'), getEmployerJobs);

// @route   GET /api/jobs/:id
router.get('/:id', getJobById);

// @route   PUT /api/jobs/:id
router.put('/:id', protect, authorizeRoles('employer'), updateJob);

// @route   DELETE /api/jobs/:id
router.delete('/:id', protect, authorizeRoles('employer'), deleteJob);

module.exports = router;