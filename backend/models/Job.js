const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  requirements: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'IT & Software',
      'Marketing',
      'Sales',
      'Finance',
      'Education',
      'Healthcare',
      'Engineering',
      'Design',
      'Customer Support',
      'Other',
    ],
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Internship', 'Freelance'],
    default: 'Full-time',
  },
  location: {
    type: String,
    default: '',
  },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'PKR' },
  },
  deadline: {
    type: Date,
    required: [true, 'Please add an application deadline'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  applicantsCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);