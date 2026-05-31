import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SeekerProfile = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    about: '',
    skills: '',
  })

  const sidebarLinks = [
    { label: 'Dashboard', icon: '🏠', path: '/seeker/dashboard' },
    { label: 'Browse Jobs', icon: '🔍', path: '/jobs' },
    { label: 'My Applications', icon: '📋', path: '/seeker/applications' },
    { label: 'Saved Jobs', icon: '❤️', path: '/seeker/saved' },
    { label: 'My Profile', icon: '👤', path: '/seeker/profile' },
  ]

  useEffect(() => {
    if (!user || user.role !== 'jobseeker') {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/auth/me', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) {
        setFormData({
          phone: data.data.phone || '',
          location: data.data.location || '',
          about: data.data.about || '',
          skills: '',
        })
      }
    } catch (err) {
      setError('Failed to load profile')
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
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(s => s.trim()).filter(s => s)
        : []

      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          phone: formData.phone,
          location: formData.location,
          about: formData.about,
          skills: skillsArray,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Profile updated successfully!')
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
          <div style={{ color: 'var(--green-accent)', fontSize: '0.78rem', marginTop: '2px' }}>Job Seeker</div>
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
            My Profile
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            Update your profile information visible to employers
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-text)' }}>
            Loading...
          </div>
        ) : (
          <div>

            {/* Profile Card */}
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--teal-btn), var(--green-accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800',
                color: 'white',
                flexShrink: 0,
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: '700' }}>
                  {user?.name}
                </div>
                <div style={{ color: 'var(--gray-text)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {user?.email}
                </div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(26,92,92,0.2)',
                  border: '1px solid var(--teal-btn)',
                  borderRadius: '50px',
                  padding: '2px 12px',
                  color: 'var(--green-accent)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginTop: '8px',
                }}>
                  Job Seeker
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '32px',
            }}>

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

              <form onSubmit={handleSubmit}>
                <div className="row">

                  {/* Phone */}
                  <div className="col-md-6 mb-4">
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      style={inputStyle}
                      placeholder="e.g. 0300-1234567"
                      value={formData.phone}
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
                      placeholder="e.g. Lahore, Pakistan"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Skills */}
                  <div className="col-12 mb-4">
                    <label style={labelStyle}>Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      style={inputStyle}
                      placeholder="e.g. React, Node.js, MongoDB, Python"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                    <div style={{ color: 'var(--gray-text)', fontSize: '0.78rem', marginTop: '6px' }}>
                      Separate each skill with a comma
                    </div>
                  </div>

                  {/* About */}
                  <div className="col-12 mb-4">
                    <label style={labelStyle}>About Me</label>
                    <textarea
                      name="about"
                      style={{ ...inputStyle, minHeight: '130px', resize: 'vertical' }}
                      placeholder="Write a short bio about yourself, your experience and career goals..."
                      value={formData.about}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit */}
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
                      {saving ? 'Saving...' : '💾 Save Profile'}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeekerProfile
