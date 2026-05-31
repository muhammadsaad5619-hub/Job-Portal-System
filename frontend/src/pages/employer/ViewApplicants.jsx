import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ViewApplicants = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [applicants, setApplicants] = useState([])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

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
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      const res1 = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/applications/job/' + jobId, {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data1 = await res1.json()
      if (data1.success) setApplicants(data1.data)

      const res2 = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/jobs/' + jobId)
      const data2 = await res2.json()
      if (data2.success) setJobTitle(data2.data.title)
    } catch (err) {
      setError('Failed to load applicants')
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId)
    try {
      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/applications/' + applicationId + '/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setApplicants(applicants.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        ))
      }
    } catch (err) {
      setError('Failed to update status')
    }
    setUpdatingId(null)
  }

  const statusColor = (status) => {
    if (status === 'pending') return { bg: 'rgba(214,158,46,0.15)', color: '#f6ad55', border: 'rgba(214,158,46,0.4)' }
    if (status === 'shortlisted') return { bg: 'rgba(56,161,105,0.15)', color: '#68d391', border: 'rgba(56,161,105,0.4)' }
    if (status === 'rejected') return { bg: 'rgba(229,62,62,0.15)', color: '#fc8181', border: 'rgba(229,62,62,0.4)' }
    if (status === 'hired') return { bg: 'rgba(49,130,206,0.15)', color: '#63b3ed', border: 'rgba(49,130,206,0.4)' }
    return { bg: 'transparent', color: 'var(--gray-text)', border: 'var(--border-color)' }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>
              Applicants
            </h1>
            {jobTitle && (
              <p style={{ color: 'var(--green-accent)', fontSize: '0.92rem', margin: 0, fontWeight: '600' }}>
                For: {jobTitle}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/employer/jobs')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--gray-text)',
              cursor: 'pointer',
              fontSize: '0.88rem',
            }}
          >
            Back to Jobs
          </button>
        </div>

        {/* Stats */}
        {applicants.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total', value: applicants.length, color: '#63b3ed' },
              { label: 'Pending', value: applicants.filter(a => a.status === 'pending').length, color: '#f6ad55' },
              { label: 'Shortlisted', value: applicants.filter(a => a.status === 'shortlisted').length, color: '#68d391' },
              { label: 'Hired', value: applicants.filter(a => a.status === 'hired').length, color: '#76e4f7' },
              { label: 'Rejected', value: applicants.filter(a => a.status === 'rejected').length, color: '#fc8181' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 20px',
                textAlign: 'center',
              }}>
                <div style={{ color: stat.color, fontSize: '1.3rem', fontWeight: '800' }}>{stat.value}</div>
                <div style={{ color: 'var(--gray-text)', fontSize: '0.78rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

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

        {/* Applicants List */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-text)' }}>
              Loading applicants...
            </div>
          ) : applicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👥</div>
              <div style={{ color: 'var(--gray-text)', fontSize: '0.9rem' }}>
                No applicants yet for this job
              </div>
            </div>
          ) : (
            <div>
              {applicants.map((app, index) => {
                const sc = statusColor(app.status)
                return (
                  <div key={index} style={{
                    background: 'var(--secondary-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '20px 24px',
                    marginBottom: '14px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>

                      {/* Left - Applicant Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--teal-btn), var(--green-accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: 'white',
                            flexShrink: 0,
                          }}>
                            {app.applicant?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>
                              {app.applicant?.name}
                            </div>
                            <div style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                              {app.applicant?.email}
                            </div>
                          </div>
                        </div>

                        {/* Applied date, cover letter, resume */}
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                            📅 Applied: {new Date(app.appliedAt).toLocaleDateString()}
                          </span>

                          {app.coverLetter && (
                            <span style={{
                              background: 'rgba(26,92,92,0.15)',
                              border: '1px solid rgba(26,92,92,0.4)',
                              color: 'var(--gray-text)',
                              fontSize: '0.78rem',
                              padding: '3px 10px',
                              borderRadius: '50px',
                            }}>
                              📝 Cover Letter
                            </span>
                          )}

                          {app.resumeUrl && (
                            <button
                              onClick={() => window.open('https://job-portal-system-production-cd99.up.railway.app/' + app.resumeUrl, '_blank')}
                              style={{
                                background: 'rgba(107,143,62,0.15)',
                                border: '1px solid rgba(107,143,62,0.4)',
                                color: 'var(--green-accent)',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                padding: '3px 12px',
                                borderRadius: '50px',
                                fontWeight: '600',
                                transition: 'all 0.3s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(107,143,62,0.3)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'rgba(107,143,62,0.15)'}
                            >
                              📄 View Resume
                            </button>
                          )}

                          {!app.resumeUrl && (
                            <span style={{
                              background: 'rgba(229,62,62,0.1)',
                              border: '1px solid rgba(229,62,62,0.3)',
                              color: '#fc8181',
                              fontSize: '0.78rem',
                              padding: '3px 10px',
                              borderRadius: '50px',
                            }}>
                              No Resume
                            </span>
                          )}
                        </div>

                        {/* Cover Letter Preview */}
                        {app.coverLetter && (
                          <div style={{
                            marginTop: '12px',
                            padding: '10px 14px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            color: 'var(--gray-text)',
                            fontSize: '0.82rem',
                            lineHeight: '1.6',
                          }}>
                            {app.coverLetter.length > 200
                              ? app.coverLetter.substring(0, 200) + '...'
                              : app.coverLetter}
                          </div>
                        )}
                      </div>

                      {/* Right - Status */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <span style={{
                          background: sc.bg,
                          color: sc.color,
                          border: '1px solid ' + sc.border,
                          borderRadius: '50px',
                          padding: '4px 14px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          textTransform: 'capitalize',
                        }}>
                          {app.status}
                        </span>

                        <select
                          value={app.status}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                          style={{
                            background: 'var(--input-bg)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>

                        {updatingId === app._id && (
                          <span style={{ color: 'var(--gray-text)', fontSize: '0.75rem' }}>
                            Updating...
                          </span>
                        )}
                      </div>

                    </div>
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

export default ViewApplicants
