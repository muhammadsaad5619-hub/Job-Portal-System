const asyncHandler = require('express-async-handler')
const Profile = require('../models/Profile')

const toggleSaveJob = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id })
  if (!profile) { res.status(404); throw new Error('Profile not found') }

  const jobId = req.params.jobId
  const isSaved = profile.savedJobs.includes(jobId)

  if (isSaved) {
    profile.savedJobs = profile.savedJobs.filter(id => id.toString() !== jobId)
  } else {
    profile.savedJobs.push(jobId)
  }
  await profile.save()

  res.json({ success: true, message: isSaved ? 'Job removed from saved' : 'Job saved successfully', isSaved: !isSaved })
})

const getSavedJobs = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate({
    path: 'savedJobs',
    populate: { path: 'company', select: 'companyName logo' },
  })
  if (!profile) { res.status(404); throw new Error('Profile not found') }
  res.json({ success: true, data: profile.savedJobs })
})

module.exports = { toggleSaveJob, getSavedJobs }