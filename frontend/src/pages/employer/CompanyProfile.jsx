import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const CompanyProfile = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    location: '',
    website: '',
    industry: '',
    companySize: '1-10',
  })

  const sidebarLinks = [
    { label: 'Dashboard', icon: '🏠', path: '/employer/dashboard' },
    { label: 'Post a Job', icon: '➕', path: '/employer/post-job' },
    { label: 'Manage Jobs', icon: '💼', path: '/employer/jobs' },
    { label: 'Company Profile', icon: '🏢', path: '/employer/company' },
  ]

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/login')
      return
    }
    fetchCompany()
  }, [])

  const fetchCompany = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/company/profile', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) {
        setFormData({
          companyName: data.data.companyName || '',
          description: data.data.description || '',
          location: data.data.location || '',
          website: data.data.website || '',
          industry: data.data.industry || '',
          companySize: data.data.companySize || '1-10',
        })
      }
    } catch (err) {
      setError('Failed to load company profile')
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('http://localhost:5000/api/company/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Company profile updated successfully!')
      } else {
        setError(data.message || 'Failed to update profile')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    }
    setSaving(false)
  }

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    color: 'white',
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
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>
            Company Profile
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            Update your company information visible to job seekers
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-text)' }}>
            Loading...
          </div>
        ) : (
          <div style={{
            background: 'var(--card-dark)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '32px',
          }}>

            {/* Company Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--teal-btn), var(--green-accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800',
                color: 'white',
              }}>
                {formData.companyName?.charAt(0).toUpperCase() || '🏢'}
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: '700' }}>
                  {formData.companyName || 'Your Company Name'}
                </div>
                <div style={{ color: 'var(--gray-text)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {formData.industry || 'Industry not set'} • {formData.location || 'Location not set'}
                </div>
              </div>
            </div>

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
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* Company Name */}
                <div className="col-md-6 mb-4">
                  <label style={labelStyle}>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    style={inputStyle}
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Industry */}
                <div className="col-md-6 mb-4">
                  <label style={labelStyle}>Industry</label>
                  <input
                    type="text"
                    name="industry"
                    style={inputStyle}
                    placeholder="e.g. IT, Finance, Healthcare"
                    value={formData.industry}
                    onChange={handleChange}
                  />
                </div>

                {/* Location */}
                <div className="col-md-6 mb-4">
                  <label style={labelStyle}>Location</label>
                  <input
                    type="text"
                    name="location"
                    style={inputStyle}
                    placeholder="e.g. Lahore, Karachi"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                {/* Website */}
                <div className="col-md-6 mb-4">
                  <label style={labelStyle}>Website</label>
                  <input
                    type="text"
                    name="website"
                    style={inputStyle}
                    placeholder="e.g. https://yourcompany.com"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                {/* Company Size */}
                <div className="col-md-6 mb-4">
                  <label style={labelStyle}>Company Size</label>
                  <select
                    name="companySize"
                    style={inputStyle}
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>

                {/* Description */}
                <div className="col-12 mb-4">
                  <label style={labelStyle}>Company Description</label>
                  <textarea
                    name="description"
                    style={{ ...inputStyle, minHeight: '130px', resize: 'vertical' }}
                    placeholder="Describe your company, culture, and what makes it a great place to work..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn-teal"
                    disabled={saving}
                    style={{
                      padding: '12px 32px',
                      fontSize: '0.95rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      opacity: saving ? 0.7 : 1,
                      cursor: saving ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {saving ? 'Saving...' : '💾 Save Company Profile'}
                  </button>
                </div>

              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyProfile