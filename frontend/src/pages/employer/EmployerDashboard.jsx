import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const EmployerDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/jobs/employer/myjobs', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        const jobs = data.data
        setRecentJobs(jobs.slice(0, 5))
        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.filter(j => j.isActive).length,
          totalApplications: jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0),
        })
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const sidebarLinks = [
    { label: 'Dashboard', icon: '🏠', path: '/employer/dashboard' },
    { label: 'Post a Job', icon: '➕', path: '/employer/post-job' },
    { label: 'Manage Jobs', icon: '💼', path: '/employer/jobs' },
    { label: 'Company Profile', icon: '🏢', path: '/employer/company' },
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
          <div style={{ color: 'var(--green-accent)', fontSize: '0.78rem', marginTop: '2px' }}>Employer</div>
          <div style={{ color: 'var(--gray-text)', fontSize: '0.78rem' }}>{user?.email}</div>
        </div>

        {/* Links */}
        <div style={{ padding: '16px 0', flex: 1 }}>
          {sidebarLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              style={{
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
              }}
            >
              <span>{link.icon}</span>
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
            Welcome, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            Manage your job postings and applications
          </p>
        </div>

        {/* Stats */}
        <div className='row mb-4'>
          {[
            { label: 'Total Jobs Posted', value: stats.totalJobs, color: '#3182ce', icon: '💼' },
            { label: 'Active Jobs', value: stats.activeJobs, color: '#38a169', icon: '✅' },
            { label: 'Total Applications', value: stats.totalApplications, color: '#805ad5', icon: '📋' },
          ].map((stat, index) => (
            <div className='col-lg-4 col-md-6 mb-3' key={index}>
              <div style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '24px',
                borderTop: `3px solid ${stat.color}`,
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{stat.icon}</div>
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
          <div className='d-flex gap-3 flex-wrap'>
            <button
              className='btn-teal'
              onClick={() => navigate('/employer/post-job')}
              style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem' }}
            >
              ➕ Post New Job
            </button>
            <button
              onClick={() => navigate('/employer/jobs')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.88rem',
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
              💼 Manage Jobs
            </button>
            <button
              onClick={() => navigate('/employer/company')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.88rem',
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
              🏢 Company Profile
            </button>
          </div>
        </div>

        {/* Recent Jobs */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h5 style={{ color: 'white', fontWeight: '700', margin: 0 }}>Recent Job Postings</h5>
            <Link to='/employer/jobs' style={{ color: 'var(--green-accent)', fontSize: '0.85rem', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-text)' }}>Loading...</div>
          ) : recentJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
              <div style={{ color: 'var(--gray-text)', fontSize: '0.9rem', marginBottom: '16px' }}>
                You have not posted any jobs yet
              </div>
              <button
                className='btn-teal'
                onClick={() => navigate('/employer/post-job')}
                style={{ padding: '10px 24px', borderRadius: '8px' }}
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '12px',
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                marginBottom: '8px',
              }}>
                {['JOB TITLE', 'CATEGORY', 'TYPE', 'APPLICANTS', 'STATUS'].map((h, i) => (
                  <span key={i} style={{ color: 'var(--gray-text)', fontSize: '0.78rem', fontWeight: '600' }}>{h}</span>
                ))}
              </div>

              {recentJobs.map((job, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    gap: '12px',
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'white', fontSize: '0.88rem', fontWeight: '600' }}>{job.title}</span>
                  <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>{job.category}</span>
                  <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>{job.jobType}</span>
                  <span style={{ color: 'var(--green-accent)', fontSize: '0.82rem', fontWeight: '700' }}>
                    {job.applicantsCount || 0}
                  </span>
                  <span style={{
                    background: job.isActive ? 'rgba(56,161,105,0.15)' : 'rgba(229,62,62,0.15)',
                    color: job.isActive ? '#38a169' : '#e53e3e',
                    border: `1px solid ${job.isActive ? '#38a16955' : '#e53e3e55'}`,
                    borderRadius: '50px',
                    padding: '3px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'inline-block',
                  }}>
                    {job.isActive ? 'Active' : 'Inactive'}
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

export default EmployerDashboard
