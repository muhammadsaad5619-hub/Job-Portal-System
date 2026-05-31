const express = require('express')
const router = express.Router()
const { toggleSaveJob, getSavedJobs } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const { authorizeRoles } = require('../middleware/roleMiddleware')

router.put('/save-job/:jobId', protect, authorizeRoles('jobseeker'), toggleSaveJob)
router.get('/saved-jobs', protect, authorizeRoles('jobseeker'), getSavedJobs)

module.exports = router