import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
    totalJobSeekers: 0,
    totalEmployers: 0,
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const sidebarLinks = [
    { label: 'Dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ), path: '/admin/dashboard' },
    { label: 'Manage Users', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ), path: '/admin/users' },
    { label: 'Manage Jobs', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
      </svg>
    ), path: '/admin/jobs' },
  ]

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) {
        setStats({
          totalUsers: data.data.totalUsers,
          totalJobs: data.data.totalJobs,
          totalApplications: data.data.totalApplications,
          totalCompanies: data.data.totalCompanies,
          totalJobSeekers: data.data.totalJobSeekers,
          totalEmployers: data.data.totalEmployers,
        })
        setRecentUsers(data.data.recentUsers)
        setRecentJobs(data.data.recentJobs)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
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
            background: 'linear-gradient(135deg, #e53e3e, #805ad5)',
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
          <div style={{ color: '#fc8181', fontSize: '0.78rem', marginTop: '2px' }}>Administrator</div>
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
              background: window.location.pathname === link.path ? 'rgba(229,62,62,0.15)' : 'transparent',
              borderLeft: window.location.pathname === link.path ? '3px solid #e53e3e' : '3px solid transparent',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'all 0.3s',
            }}>
              {link.icon}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
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
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            Platform overview and management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, color: '#3182ce', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3182ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            )},
            { label: 'Total Jobs', value: stats.totalJobs, color: '#38a169', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
              </svg>
            )},
            { label: 'Total Applications', value: stats.totalApplications, color: '#805ad5', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#805ad5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            )},
            { label: 'Total Companies', value: stats.totalCompanies, color: '#d69e2e', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d69e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            )},
            { label: 'Job Seekers', value: stats.totalJobSeekers, color: '#0bc5ea', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0bc5ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
            )},
            { label: 'Employers', value: stats.totalEmployers, color: '#e53e3e', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
                <line x1="12" y1="12" x2="12" y2="16"></line>
                <line x1="10" y1="14" x2="14" y2="14"></line>
              </svg>
            )},
          ].map((stat, index) => (
            <div className="col-lg-4 col-md-6 mb-3" key={index}>
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
            <button
              onClick={() => navigate('/admin/users')}
              className="btn-teal"
              style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>
              </svg>
              Manage Users
            </button>
            <button
              onClick={() => navigate('/admin/jobs')}
              style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--gray-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-btn)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--gray-text)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
              </svg>
              Manage Jobs
            </button>
          </div>
        </div>

        <div className="row">

          {/* Recent Users */}
          <div className="col-lg-6 mb-4">
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h5 style={{ color: 'white', fontWeight: '700', margin: 0 }}>Recent Users</h5>
                <Link to="/admin/users" style={{ color: 'var(--green-accent)', fontSize: '0.85rem', textDecoration: 'none' }}>
                  View All →
                </Link>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-text)' }}>Loading...</div>
              ) : recentUsers.map((u, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: u.role === 'admin' ? 'linear-gradient(135deg, #e53e3e, #805ad5)' : u.role === 'employer' ? 'linear-gradient(135deg, var(--teal-btn), #3182ce)' : 'linear-gradient(135deg, var(--teal-btn), var(--green-accent))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: 'white',
                    flexShrink: 0,
                  }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontSize: '0.88rem', fontWeight: '600' }}>{u.name}</div>
                    <div style={{ color: 'var(--gray-text)', fontSize: '0.78rem' }}>{u.email}</div>
                  </div>
                  <span style={{
                    background: u.role === 'admin' ? 'rgba(229,62,62,0.15)' : u.role === 'employer' ? 'rgba(49,130,206,0.15)' : 'rgba(56,161,105,0.15)',
                    color: u.role === 'admin' ? '#fc8181' : u.role === 'employer' ? '#63b3ed' : '#68d391',
                    border: '1px solid ' + (u.role === 'admin' ? 'rgba(229,62,62,0.3)' : u.role === 'employer' ? 'rgba(49,130,206,0.3)' : 'rgba(56,161,105,0.3)'),
                    borderRadius: '50px',
                    padding: '2px 10px',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="col-lg-6 mb-4">
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h5 style={{ color: 'white', fontWeight: '700', margin: 0 }}>Recent Jobs</h5>
                <Link to="/admin/jobs" style={{ color: 'var(--green-accent)', fontSize: '0.85rem', textDecoration: 'none' }}>
                  View All →
                </Link>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-text)' }}>Loading...</div>
              ) : recentJobs.map((job, i) => (
                <div key={i} style={{
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  <div style={{ color: 'white', fontSize: '0.88rem', fontWeight: '600', marginBottom: '4px' }}>
                    {job.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.78rem' }}>
                      {job.company?.companyName || 'N/A'}
                    </span>
                    <span style={{
                      background: job.isActive ? 'rgba(56,161,105,0.15)' : 'rgba(229,62,62,0.15)',
                      color: job.isActive ? '#68d391' : '#fc8181',
                      border: '1px solid ' + (job.isActive ? 'rgba(56,161,105,0.3)' : 'rgba(229,62,62,0.3)'),
                      borderRadius: '50px',
                      padding: '2px 10px',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                    }}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard