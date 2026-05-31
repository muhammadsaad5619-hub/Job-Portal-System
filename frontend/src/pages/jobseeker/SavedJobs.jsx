import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SavedJobs = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const sidebarLinks = [
    { label: 'Dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ), path: '/seeker/dashboard' },
    { label: 'Browse Jobs', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ), path: '/jobs' },
    { label: 'My Applications', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    ), path: '/seeker/applications' },
    { label: 'Saved Jobs', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ), path: '/seeker/saved' },
    { label: 'My Profile', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
      </svg>
    ), path: '/seeker/profile' },
  ]

  useEffect(() => {
    if (!user || user.role !== 'jobseeker') { navigate('/login'); return }
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/saved-jobs', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) setSavedJobs(data.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleUnsave = async (jobId) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/save-job/' + jobId, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) {
        setSavedJobs(savedJobs.filter(job => job._id !== jobId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--primary-dark)' }}>

      {/* Sidebar */}
      <div style={{
        width: '260px', background: 'var(--secondary-dark)', borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column', padding: '30px 0',
        position: 'fixed', height: '100vh', overflowY: 'auto',
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--teal-btn), var(--green-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '12px',
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
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
              color: window.location.pathname === link.path ? 'white' : 'var(--gray-text)',
              background: window.location.pathname === link.path ? 'rgba(26,92,92,0.3)' : 'transparent',
              borderLeft: window.location.pathname === link.path ? '3px solid var(--teal-btn)' : '3px solid transparent',
              textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s',
            }}>
              {link.icon}<span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={() => { logout(); navigate('/') }} style={{
            width: '100%', padding: '10px', background: 'transparent',
            border: '1px solid var(--border-color)', color: 'var(--gray-text)',
            borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e53e3e'; e.currentTarget.style.color = '#e53e3e' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--gray-text)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>
            Saved Jobs 
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            Jobs you have bookmarked for later — {savedJobs.length} saved
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-text)' }}>Loading...</div>
        ) : savedJobs.length === 0 ? (
          <div style={{
            background: 'var(--card-dark)', border: '1px solid var(--border-color)',
            borderRadius: '12px', padding: '80px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🤍</div>
            <h5 style={{ color: 'white', marginBottom: '8px' }}>No Saved Jobs Yet</h5>
            <p style={{ color: 'var(--gray-text)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Browse jobs and click the heart icon to save them here
            </p>
            <button className="btn-teal" onClick={() => navigate('/jobs')}
              style={{ padding: '12px 32px', borderRadius: '8px' }}>
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="row">
            {savedJobs.map((job, index) => (
              <div className="col-lg-6 mb-4" key={index}>
                <div style={{
                  background: 'var(--card-dark)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', padding: '24px',
                  borderLeft: '3px solid var(--teal-btn)', transition: 'transform 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Job Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h6 style={{ color: 'var(--green-accent)', fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>
                        {job.title}
                      </h6>
                      <p style={{ color: 'white', fontSize: '0.85rem', margin: 0 }}>
                        {job.company?.companyName || 'N/A'}
                      </p>
                    </div>
                    {/* Unsave Button */}
                    <button onClick={() => handleUnsave(job._id)} style={{
                      background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)',
                      color: '#e53e3e', borderRadius: '8px', padding: '6px 12px',
                      cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.3s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,62,62,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(229,62,62,0.1)'}
                    >
                       Unsave
                    </button>
                  </div>

                  {/* Job Details */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>📍 {job.location || 'N/A'}</span>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>💼 {job.jobType || 'N/A'}</span>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>🏷️ {job.category || 'N/A'}</span>
                  </div>

                  {/* Deadline */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
                    padding: '8px 12px', marginBottom: '16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.8rem' }}>
                      📅 Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                    </span>
                    {job.salary?.min > 0 && (
                      <span style={{ color: 'var(--green-accent)', fontSize: '0.8rem', fontWeight: '600' }}>
                        {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-teal" onClick={() => navigate('/jobs/' + job._id)}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                      View & Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedJobs