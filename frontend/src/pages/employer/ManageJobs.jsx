import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ManageJobs = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

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
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs/employer/myjobs', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        setJobs(data.data)
      }
    } catch (err) {
      setError('Failed to load jobs')
    }
    setLoading(false)
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    setDeletingId(jobId)
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        setJobs(jobs.filter(j => j._id !== jobId))
      } else {
        setError(data.message || 'Failed to delete job')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    }
    setDeletingId(null)
  }

  const isExpired = (deadline) => new Date(deadline) < new Date()

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
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>
              Manage Jobs
            </h1>
            <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem', margin: 0 }}>
              View, manage and delete your job postings
            </p>
          </div>
          <button
            className='btn-teal'
            onClick={() => navigate('/employer/post-job')}
            style={{ padding: '10px 22px', borderRadius: '8px', fontSize: '0.9rem' }}
          >
            ➕ Post New Job
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid rgba(229,62,62,0.4)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#fc8181',
            fontSize: '0.88rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Jobs List */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
        }}>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-text)' }}>
              Loading jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
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
              {/* Stats Row */}
              <div className='d-flex gap-3 mb-4 flex-wrap'>
                <div style={{
                  background: 'rgba(49,130,206,0.1)',
                  border: '1px solid rgba(49,130,206,0.3)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: '#63b3ed',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}>
                  Total: {jobs.length} Jobs
                </div>
                <div style={{
                  background: 'rgba(56,161,105,0.1)',
                  border: '1px solid rgba(56,161,105,0.3)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: '#68d391',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}>
                  Active: {jobs.filter(j => j.isActive && !isExpired(j.deadline)).length}
                </div>
                <div style={{
                  background: 'rgba(229,62,62,0.1)',
                  border: '1px solid rgba(229,62,62,0.3)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: '#fc8181',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}>
                  Expired: {jobs.filter(j => isExpired(j.deadline)).length}
                </div>
              </div>

              {/* Job Cards */}
              {jobs.map((job, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--secondary-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '20px 24px',
                    marginBottom: '14px',
                    borderLeft: `4px solid ${isExpired(job.deadline) ? '#e53e3e' : '#38a169'}`,
                  }}
                >
                  <div className='d-flex justify-content-between align-items-start flex-wrap gap-3'>

                    {/* Left - Job Info */}
                    <div style={{ flex: 1 }}>
                      <div className='d-flex align-items-center gap-2 mb-1 flex-wrap'>
                        <span style={{ color: 'white', fontSize: '1rem', fontWeight: '700' }}>
                          {job.title}
                        </span>
                        <span style={{
                          background: isExpired(job.deadline) ? 'rgba(229,62,62,0.15)' : 'rgba(56,161,105,0.15)',
                          color: isExpired(job.deadline) ? '#fc8181' : '#68d391',
                          border: `1px solid ${isExpired(job.deadline) ? '#e53e3e55' : '#38a16955'}`,
                          borderRadius: '50px',
                          padding: '2px 10px',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                        }}>
                          {isExpired(job.deadline) ? 'Expired' : 'Active'}
                        </span>
                      </div>

                      <div className='d-flex gap-3 flex-wrap mt-2'>
                        <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                          📂 {job.category}
                        </span>
                        <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                          💼 {job.jobType}
                        </span>
                        <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                          📍 {job.location}
                        </span>
                        <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                          📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </span>
                        <span style={{ color: 'var(--green-accent)', fontSize: '0.82rem', fontWeight: '600' }}>
                          👥 {job.applicantsCount || 0} Applicants
                        </span>
                      </div>

                      {/* Salary */}
                      {(job.salary?.min > 0 || job.salary?.max > 0) && (
                        <div style={{ color: 'var(--gray-text)', fontSize: '0.82rem', marginTop: '6px' }}>
                          💰 PKR {job.salary?.min?.toLocaleString()} – {job.salary?.max?.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Right - Action Buttons */}
                    <div className='d-flex gap-2 align-items-center'>
                      <button
                        onClick={() => navigate(`/employer/applicants/${job._id}`)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'rgba(49,130,206,0.15)',
                          border: '1px solid rgba(49,130,206,0.4)',
                          color: '#63b3ed',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(49,130,206,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(49,130,206,0.15)'}
                      >
                        👁️ View Applicants
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={deletingId === job._id}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'rgba(229,62,62,0.1)',
                          border: '1px solid rgba(229,62,62,0.4)',
                          color: '#fc8181',
                          fontSize: '0.82rem',
                          cursor: deletingId === job._id ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s',
                          opacity: deletingId === job._id ? 0.6 : 1,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,62,62,0.25)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(229,62,62,0.1)'}
                      >
                        {deletingId === job._id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageJobs