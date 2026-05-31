import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MyApplications = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/applications/myapplications', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) setApplications(data.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const statusColor = (status) => {
    if (status === 'pending') return { bg: 'rgba(214,158,46,0.15)', color: '#d69e2e', border: 'rgba(214,158,46,0.4)' }
    if (status === 'shortlisted') return { bg: 'rgba(56,161,105,0.15)', color: '#38a169', border: 'rgba(56,161,105,0.4)' }
    if (status === 'rejected') return { bg: 'rgba(229,62,62,0.15)', color: '#e53e3e', border: 'rgba(229,62,62,0.4)' }
    if (status === 'hired') return { bg: 'rgba(49,130,206,0.15)', color: '#3182ce', border: 'rgba(49,130,206,0.4)' }
    return { bg: 'transparent', color: 'var(--gray-text)', border: 'var(--border-color)' }
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--primary-dark)' }}>

      {/* Sidebar */}
      <div style={{
        width: '260px', background: 'var(--secondary-dark)', borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column', padding: '30px 0', position: 'fixed', height: '100vh', overflowY: 'auto',
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
            width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--border-color)',
            color: 'var(--gray-text)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem',
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
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>My Applications</h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>Track all your job applications</p>
        </div>

        {/* Stats Row */}
        <div className="row mb-4">
          {[
            { label: 'Total', value: applications.length, color: '#3182ce' },
            { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: '#d69e2e' },
            { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: '#38a169' },
            { label: 'Hired', value: applications.filter(a => a.status === 'hired').length, color: '#0bc5ea' },
            { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#e53e3e' },
          ].map((s, i) => (
            <div className="col mb-3" key={i}>
              <div style={{
                background: 'var(--card-dark)', border: '1px solid var(--border-color)',
                borderRadius: '10px', padding: '16px', textAlign: 'center', borderTop: '3px solid ' + s.color,
              }}>
                <div style={{ color: s.color, fontSize: '1.8rem', fontWeight: '800' }}>{s.value}</div>
                <div style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'shortlisted', 'hired', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px', borderRadius: '50px', fontSize: '0.85rem', cursor: 'pointer',
                background: filter === f ? 'var(--teal-btn)' : 'transparent',
                border: filter === f ? '1px solid var(--teal-btn)' : '1px solid var(--border-color)',
                color: filter === f ? 'white' : 'var(--gray-text)',
                textTransform: 'capitalize', transition: 'all 0.3s',
              }}>
              {f === 'all' ? 'All Applications' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div style={{ background: 'var(--card-dark)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-text)' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📄</div>
              <div style={{ color: 'var(--gray-text)', fontSize: '0.9rem', marginBottom: '16px' }}>
                {filter === 'all' ? 'You have not applied to any jobs yet' : 'No ' + filter + ' applications'}
              </div>
              {filter === 'all' && (
                <button className="btn-teal" onClick={() => navigate('/jobs')}
                  style={{ padding: '10px 24px', borderRadius: '8px' }}>
                  Browse Jobs
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
                gap: '12px', padding: '10px 16px',
                background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '8px',
              }}>
                {['JOB TITLE', 'COMPANY', 'TYPE', 'APPLIED DATE', 'STATUS'].map((h, i) => (
                  <span key={i} style={{ color: 'var(--gray-text)', fontSize: '0.78rem', fontWeight: '600' }}>{h}</span>
                ))}
              </div>

              {filtered.map((app, index) => {
                const sc = statusColor(app.status)
                return (
                  <div key={index} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
                    gap: '12px', padding: '16px', borderBottom: '1px solid var(--border-color)', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ color: 'white', fontSize: '0.88rem', fontWeight: '600' }}>
                        {app.job?.title || 'N/A'}
                      </div>
                      <div style={{ color: 'var(--gray-text)', fontSize: '0.78rem', marginTop: '2px' }}>
                        📍 {app.job?.location || 'N/A'}
                      </div>
                    </div>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.85rem' }}>
                      {app.job?.company?.companyName || 'N/A'}
                    </span>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                      {app.job?.jobType || 'N/A'}
                    </span>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <span style={{
                      background: sc.bg, color: sc.color, border: '1px solid ' + sc.border,
                      borderRadius: '50px', padding: '4px 12px', fontSize: '0.75rem',
                      fontWeight: '600', textTransform: 'capitalize', display: 'inline-block',
                    }}>
                      {app.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyApplications
