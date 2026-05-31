import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const JobSearch = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedJobIds, setSavedJobIds] = useState([])
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    jobType: '',
    location: '',
  })

  useEffect(() => {
    fetchJobs()
    if (user?.role === 'jobseeker') fetchSavedJobs()
  }, [])

  const fetchJobs = async (f = filters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (f.keyword) params.append('keyword', f.keyword)
      if (f.category) params.append('category', f.category)
      if (f.jobType) params.append('jobType', f.jobType)
      if (f.location) params.append('location', f.location)

      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/jobs?' + params.toString())
      const data = await res.json()
      if (data.success) setJobs(data.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/users/saved-jobs', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) setSavedJobIds(data.data.map(j => j._id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveToggle = async (jobId) => {
    if (!user) { navigate('/login'); return }
    try {
      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/users/save-job/' + jobId, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) {
        setSavedJobIds(prev =>
          prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(filters)
  }

  const handleClear = () => {
    const cleared = { keyword: '', category: '', jobType: '', location: '' }
    setFilters(cleared)
    fetchJobs(cleared)
  }

  const categories = [
    'IT & Software', 'Marketing', 'Sales', 'Finance',
    'Education', 'Healthcare', 'Engineering', 'Design',
    'Customer Support', 'Other',
  ]

  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Freelance']

  return (
    <div style={{ background: 'var(--primary-dark)', minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{
        background: 'var(--secondary-dark)',
        borderBottom: '1px solid var(--border-color)',
        padding: '40px 0',
      }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            Find Your Dream Job
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.95rem', margin: 0 }}>
            Browse through hundreds of verified job opportunities
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 15px' }}>
        <div className="row">

          {/* Left — Filters */}
          <div className="col-lg-3 mb-4">
            <div style={{
              background: 'var(--card-dark)', border: '1px solid var(--border-color)',
              borderRadius: '12px', padding: '24px', position: 'sticky', top: '80px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h6 style={{ color: 'white', fontWeight: '700', margin: 0 }}>🔍 Filters</h6>
                <button onClick={handleClear} style={{
                  background: 'transparent', border: 'none',
                  color: 'var(--green-accent)', fontSize: '0.8rem', cursor: 'pointer',
                }}>
                  Clear All
                </button>
              </div>

              <form onSubmit={handleSearch}>
                {/* Keyword */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'var(--gray-text)', fontSize: '0.82rem', marginBottom: '6px', display: 'block' }}>
                    Job Title / Keyword
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    className="form-control-custom"
                    value={filters.keyword}
                    onChange={e => setFilters({ ...filters, keyword: e.target.value })}
                  />
                </div>

                {/* Location */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'var(--gray-text)', fontSize: '0.82rem', marginBottom: '6px', display: 'block' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore, Karachi"
                    className="form-control-custom"
                    value={filters.location}
                    onChange={e => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                {/* Category */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'var(--gray-text)', fontSize: '0.82rem', marginBottom: '6px', display: 'block' }}>
                    Category
                  </label>
                  <select
                    className="form-control-custom"
                    value={filters.category}
                    onChange={e => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Job Type */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'var(--gray-text)', fontSize: '0.82rem', marginBottom: '6px', display: 'block' }}>
                    Job Type
                  </label>
                  <select
                    className="form-control-custom"
                    value={filters.jobType}
                    onChange={e => setFilters({ ...filters, jobType: e.target.value })}
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <button type="submit" className="btn-teal"
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', fontSize: '0.9rem' }}>
                  Search Jobs
                </button>
              </form>
            </div>
          </div>

          {/* Right — Job Cards */}
          <div className="col-lg-9">

            {/* Results Count */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--gray-text)', fontSize: '0.9rem' }}>
                {loading ? 'Searching...' : jobs.length + ' jobs found'}
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-text)' }}>
                Loading jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div style={{
                background: 'var(--card-dark)', border: '1px solid var(--border-color)',
                borderRadius: '12px', padding: '80px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                <h5 style={{ color: 'white', marginBottom: '8px' }}>No Jobs Found</h5>
                <p style={{ color: 'var(--gray-text)', fontSize: '0.9rem' }}>
                  Try adjusting your filters or search with different keywords
                </p>
                <button onClick={handleClear} className="btn-teal"
                  style={{ padding: '10px 24px', borderRadius: '8px', marginTop: '12px' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              jobs.map((job, index) => (
                <div key={index} style={{
                  background: 'var(--card-dark)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', padding: '24px', marginBottom: '16px',
                  borderLeft: '3px solid var(--teal-btn)', transition: 'transform 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>

                    {/* Job Info */}
                    <div style={{ flex: 1 }}>
                      <h5 style={{ color: 'var(--green-accent)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '4px' }}>
                        {job.title}
                      </h5>
                      <p style={{ color: 'white', fontSize: '0.88rem', marginBottom: '10px' }}>
                        🏢 {job.company?.companyName || 'N/A'}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>📍 {job.location || 'N/A'}</span>
                        <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>💼 {job.jobType}</span>
                        <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>🏷️ {job.category}</span>
                        {job.salary?.min > 0 && (
                          <span style={{ color: 'var(--green-accent)', fontSize: '0.82rem', fontWeight: '600' }}>
                            💰 {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--gray-text)', fontSize: '0.82rem', margin: 0 }}>
                        📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        👥 {job.applicantsCount} applicant{job.applicantsCount !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <button className="btn-teal" onClick={() => navigate('/jobs/' + job._id)}
                        style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        View Job →
                      </button>
                      {user?.role === 'jobseeker' && (
                        <button onClick={() => handleSaveToggle(job._id)} style={{
                          padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem',
                          background: savedJobIds.includes(job._id) ? 'rgba(229,62,62,0.1)' : 'transparent',
                          border: savedJobIds.includes(job._id) ? '1px solid rgba(229,62,62,0.4)' : '1px solid var(--border-color)',
                          color: savedJobIds.includes(job._id) ? '#e53e3e' : 'var(--gray-text)',
                          cursor: 'pointer', transition: 'all 0.3s',
                        }}>
                          {savedJobIds.includes(job._id) ? '❤️ Saved' : '🤍 Save'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobSearch
