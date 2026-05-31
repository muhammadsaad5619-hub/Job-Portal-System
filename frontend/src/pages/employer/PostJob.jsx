import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PostJob = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    category: '',
    jobType: 'Full-time',
    location: '',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
  })

  const categories = [
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
  ]

  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Freelance']

  const sidebarLinks = [
    { label: 'Dashboard', icon: '🏠', path: '/employer/dashboard' },
    { label: 'Post a Job', icon: '➕', path: '/employer/post-job' },
    { label: 'Manage Jobs', icon: '💼', path: '/employer/jobs' },
    { label: 'Company Profile', icon: '🏢', path: '/employer/company' },
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.category) {
      setError('Please select a job category')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          category: formData.category,
          jobType: formData.jobType,
          location: formData.location,
          salary: {
            min: Number(formData.salaryMin) || 0,
            max: Number(formData.salaryMax) || 0,
            currency: 'PKR',
          },
          deadline: formData.deadline,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to post job')
        setLoading(false)
        return
      }

      setSuccess('Job posted successfully!')
      setFormData({
        title: '',
        description: '',
        requirements: '',
        category: '',
        jobType: 'Full-time',
        location: '',
        salaryMin: '',
        salaryMax: '',
        deadline: '',
      })
      setTimeout(() => navigate('/employer/jobs'), 1500)

    } catch (err) {
      setError('Server error. Please try again.')
    }
    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    color: 'var(--white)',
    padding: '10px 14px',
    borderRadius: '8px',
    width: '100%',
    fontSize: '0.9rem',
    outline: 'none',
  }

  const labelStyle = {
    color: 'var(--gray-text)',
    fontSize: '0.88rem',
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--primary-dark)' }}>

      {/* Sidebar */}
      <div style={{
        width: '260px',
        background: 'var(--secondary-dark)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--teal-btn), var(--green-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '12px',
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>{user?.name}</div>
          <div style={{ color: 'var(--green-accent)', fontSize: '0.78rem', marginTop: '2px' }}>Employer</div>
          <div style={{ color: 'var(--gray-text)', fontSize: '0.78rem' }}>{user?.email}</div>
        </div>

        <div style={{ padding: '16px 0', flex: 1 }}>
          {sidebarLinks.map((link, index) => (
            <Link key={index} to={link.path} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              color: window.location.pathname === link.path ? 'white' : 'var(--gray-text)',
              background: window.location.pathname === link.path ? 'rgba(26,92,92,0.3)' : 'transparent',
              borderLeft: window.location.pathname === link.path ? '3px solid var(--teal-btn)' : '3px solid transparent',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'all 0.3s',
            }}>
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => { logout(); navigate('/') }}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--gray-text)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#e53e3e'
              e.currentTarget.style.color = '#e53e3e'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-color)'
              e.currentTarget.style.color = 'var(--gray-text)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>
            Post a New Job
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            Fill in the details below to post a new job opening
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '32px',
        }}>

          {/* Success Message */}
          {success && (
            <div style={{
              background: 'rgba(56,161,105,0.1)',
              border: '1px solid rgba(56,161,105,0.4)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              color: '#68d391',
              fontSize: '0.88rem',
            }}>
              ✅ {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(229,62,62,0.1)',
              border: '1px solid rgba(229,62,62,0.4)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              color: '#fc8181',
              fontSize: '0.88rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='row'>

              {/* Job Title */}
              <div className='col-12 mb-4'>
                <label style={labelStyle}>Job Title *</label>
                <input
                  type='text'
                  name='title'
                  style={inputStyle}
                  placeholder='e.g. Software Engineer, Marketing Manager'
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className='col-md-6 mb-4'>
                <label style={labelStyle}>Job Category *</label>
                <select
                  name='category'
                  style={inputStyle}
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value=''>Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div className='col-md-6 mb-4'>
                <label style={labelStyle}>Job Type *</label>
                <select
                  name='jobType'
                  style={inputStyle}
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                >
                  {jobTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className='col-md-6 mb-4'>
                <label style={labelStyle}>Location *</label>
                <input
                  type='text'
                  name='location'
                  style={inputStyle}
                  placeholder='e.g. Lahore, Karachi, Remote'
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Deadline */}
              <div className='col-md-6 mb-4'>
                <label style={labelStyle}>Application Deadline *</label>
                <input
                  type='date'
                  name='deadline'
                  style={inputStyle}
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Salary Min */}
              <div className='col-md-6 mb-4'>
                <label style={labelStyle}>Minimum Salary (PKR)</label>
                <input
                  type='number'
                  name='salaryMin'
                  style={inputStyle}
                  placeholder='e.g. 50000'
                  value={formData.salaryMin}
                  onChange={handleChange}
                />
              </div>

              {/* Salary Max */}
              <div className='col-md-6 mb-4'>
                <label style={labelStyle}>Maximum Salary (PKR)</label>
                <input
                  type='number'
                  name='salaryMax'
                  style={inputStyle}
                  placeholder='e.g. 100000'
                  value={formData.salaryMax}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className='col-12 mb-4'>
                <label style={labelStyle}>Job Description *</label>
                <textarea
                  name='description'
                  style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
                  placeholder='Describe the job role, responsibilities, and what the candidate will be doing...'
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Requirements */}
              <div className='col-12 mb-4'>
                <label style={labelStyle}>Requirements & Qualifications</label>
                <textarea
                  name='requirements'
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                  placeholder='List the required skills, experience, education, and qualifications...'
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className='col-12'>
                <div className='d-flex gap-3'>
                  <button
                    type='submit'
                    className='btn-teal'
                    disabled={loading}
                    style={{
                      padding: '12px 32px',
                      fontSize: '0.95rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      opacity: loading ? 0.7 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Posting Job...' : '➕ Post Job'}
                  </button>
                  <button
                    type='button'
                    onClick={() => navigate('/employer/dashboard')}
                    style={{
                      padding: '12px 32px',
                      fontSize: '0.95rem',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--gray-text)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--teal-btn)'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)'
                      e.currentTarget.style.color = 'var(--gray-text)'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostJob