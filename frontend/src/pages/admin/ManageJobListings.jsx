import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ManageJobListings = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Manage Jobs', path: '/admin/jobs' },
  ]

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/admin/jobs', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) setJobs(data.data)
    } catch (err) {
      setError('Failed to load jobs')
    }
    setLoading(false)
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    setDeletingId(jobId)
    try {
      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/admin/jobs/' + jobId, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
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

  const filteredJobs = jobs.filter(job => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'active' ? job.isActive && !isExpired(job.deadline) :
      filter === 'expired' ? isExpired(job.deadline) : true

    const matchesSearch = search === '' ? true :
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.companyName?.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

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
            Manage Job Listings
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            View and delete all job postings on the platform
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Jobs', value: jobs.length, color: '#63b3ed' },
            { label: 'Active', value: jobs.filter(j => j.isActive && !isExpired(j.deadline)).length, color: '#68d391' },
            { label: 'Expired', value: jobs.filter(j => isExpired(j.deadline)).length, color: '#fc8181' },
            { label: 'Total Applicants', value: jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0), color: '#f6ad55' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px 20px',
              textAlign: 'center',
            }}>
              <div style={{ color: stat.color, fontSize: '1.4rem', fontWeight: '800' }}>{stat.value}</div>
              <div style={{ color: 'var(--gray-text)', fontSize: '0.78rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type='text'
            placeholder='Search by job title or company...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              outline: 'none',
              width: '280px',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'active', 'expired'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '50px',
                  border: filter === f ? '2px solid var(--teal-btn)' : '1px solid var(--border-color)',
                  background: filter === f ? 'rgba(26,92,92,0.25)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--gray-text)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: filter === f ? '600' : '400',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s',
                }}
              >
                {f === 'all' ? 'All Jobs' : f === 'active' ? 'Active' : 'Expired'}
              </button>
            ))}
          </div>
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
            {error}
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
          ) : filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💼</div>
              <div style={{ color: 'var(--gray-text)', fontSize: '0.9rem' }}>No jobs found</div>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
                gap: '12px',
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                marginBottom: '8px',
              }}>
                {['JOB TITLE', 'COMPANY', 'CATEGORY', 'APPLICANTS', 'STATUS', 'ACTION'].map((h, i) => (
                  <span key={i} style={{ color: 'var(--gray-text)', fontSize: '0.78rem', fontWeight: '600' }}>
                    {h}
                  </span>
                ))}
              </div>

              {filteredJobs.map((job, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
                  gap: '12px',
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  alignItems: 'center',
                  borderLeft: '3px solid ' + (isExpired(job.deadline) ? '#e53e3e' : '#38a169'),
                  marginBottom: '4px',
                  borderRadius: '4px',
                }}>

                  {/* Title */}
                  <div>
                    <div style={{ color: 'white', fontSize: '0.88rem', fontWeight: '600' }}>
                      {job.title}
                    </div>
                    <div style={{ color: 'var(--gray-text)', fontSize: '0.75rem', marginTop: '2px' }}>
                      {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Company */}
                  <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                    {job.company?.companyName || 'N/A'}
                  </span>

                  {/* Category */}
                  <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                    {job.category}
                  </span>

                  {/* Applicants */}
                  <span style={{ color: 'var(--green-accent)', fontSize: '0.85rem', fontWeight: '700' }}>
                    {job.applicantsCount || 0}
                  </span>

                  {/* Status */}
                  <span style={{
                    background: isExpired(job.deadline) ? 'rgba(229,62,62,0.15)' : 'rgba(56,161,105,0.15)',
                    color: isExpired(job.deadline) ? '#fc8181' : '#68d391',
                    border: '1px solid ' + (isExpired(job.deadline) ? 'rgba(229,62,62,0.3)' : 'rgba(56,161,105,0.3)'),
                    borderRadius: '50px',
                    padding: '3px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'inline-block',
                  }}>
                    {isExpired(job.deadline) ? 'Expired' : 'Active'}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={deletingId === job._id}
                    style={{
                      background: 'rgba(229,62,62,0.1)',
                      border: '1px solid rgba(229,62,62,0.4)',
                      color: '#fc8181',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      cursor: deletingId === job._id ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      opacity: deletingId === job._id ? 0.6 : 1,
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,62,62,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(229,62,62,0.1)'}
                  >
                    {deletingId === job._id ? 'Deleting...' : 'Delete'}
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageJobListings
