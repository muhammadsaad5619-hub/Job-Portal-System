import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SeekerDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  })
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'jobseeker') {
      navigate('/login')
      return
    }
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/applications/myapplications', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await response.json()
      if (data.success) {
        const apps = data.data
        setRecentApplications(apps.slice(0, 5))
        setStats({
          totalApplications: apps.length,
          pending: apps.filter(a => a.status === 'pending').length,
          shortlisted: apps.filter(a => a.status === 'shortlisted').length,
          rejected: apps.filter(a => a.status === 'rejected').length,
        })
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const statusColor = (status) => {
    if (status === 'pending') return '#d69e2e'
    if (status === 'shortlisted') return '#38a169'
    if (status === 'rejected') return '#e53e3e'
    if (status === 'hired') return '#3182ce'
    return 'var(--gray-text)'
  }

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
        {/* User Info */}
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

        {/* Links */}
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
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Logout */}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
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

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            Here is your job search overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          {[
            {
              label: 'Total Applications',
              value: stats.totalApplications,
              color: '#3182ce',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3182ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              ),
            },
            {
              label: 'Pending',
              value: stats.pending,
              color: '#d69e2e',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d69e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              ),
            },
            {
              label: 'Shortlisted',
              value: stats.shortlisted,
              color: '#38a169',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ),
            },
            {
              label: 'Rejected',
              value: stats.rejected,
              color: '#e53e3e',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              ),
            },
          ].map((stat, index) => (
            <div className="col-lg-3 col-md-6 mb-3" key={index}>
              <div style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '24px',
                borderTop: '3px solid ' + stat.color,
              }}>
                <div style={{ marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ color: stat.color, fontSize: '2rem', fontWeight: '800' }}>{stat.value}</div>
                <div style={{ color: 'var(--gray-text)', fontSize: '0.85rem', marginTop: '4px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '16px' }}>Quick Actions</h5>
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn-teal" onClick={() => navigate('/jobs')}
              style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Browse Jobs
            </button>
            <button onClick={() => navigate('/seeker/profile')}
              style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--gray-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-btn)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--gray-text)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
              Update Profile
            </button>
            <button onClick={() => navigate('/seeker/applications')}
              style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--gray-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-btn)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--gray-text)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              My Applications
            </button>
            <button onClick={() => navigate('/seeker/saved')}
              style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--gray-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-btn)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--gray-text)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              Saved Jobs
            </button>
          </div>
        </div>

        {/* Recent Applications */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h5 style={{ color: 'white', fontWeight: '700', margin: 0 }}>Recent Applications</h5>
            <Link to="/seeker/applications" style={{ color: 'var(--green-accent)', fontSize: '0.85rem', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-text)' }}>
              Loading...
            </div>
          ) : recentApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div style={{ color: 'var(--gray-text)', fontSize: '0.9rem', marginBottom: '16px' }}>
                You have not applied to any jobs yet
              </div>
              <button className="btn-teal" onClick={() => navigate('/jobs')}
                style={{ padding: '10px 24px', borderRadius: '8px' }}>
                Browse Jobs Now
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                gap: '12px',
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                marginBottom: '8px',
              }}>
                {['JOB TITLE', 'COMPANY', 'DATE', 'STATUS'].map((h, i) => (
                  <span key={i} style={{ color: 'var(--gray-text)', fontSize: '0.8rem', fontWeight: '600' }}>{h}</span>
                ))}
              </div>
              {recentApplications.map((app, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                  gap: '12px',
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  alignItems: 'center',
                }}>
                  <span style={{ color: 'white', fontSize: '0.88rem', fontWeight: '600' }}>
                    {app.job?.title || 'N/A'}
                  </span>
                  <span style={{ color: 'var(--gray-text)', fontSize: '0.85rem' }}>
                    {app.job?.company?.companyName || 'N/A'}
                  </span>
                  <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                  <span style={{
                    background: statusColor(app.status) + '22',
                    color: statusColor(app.status),
                    border: '1px solid ' + statusColor(app.status) + '55',
                    borderRadius: '50px',
                    padding: '3px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    display: 'inline-block',
                  }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SeekerDashboard
