const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  about: {
    type: String,
    default: '',
  },
  skills: [
    {
      type: String,
    }
  ],
  education: [
    {
      degree: String,
      institution: String,
      year: String,
    }
  ],
  experience: [
    {
      jobTitle: String,
      company: String,
      from: String,
      to: String,
      description: String,
    }
  ],
  resumeUrl: {
    type: String,
    default: '',
  },
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);