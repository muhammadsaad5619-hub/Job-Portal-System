import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const JobDetail = () => {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/jobs/' + id)
      const data = await res.json()
      if (data.success) setJob(data.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleResumeChange = (e) => {
    const file = e.target.files[0]
    setResumeError('')
    setResumeFile(null)
    if (!file) return
    if (file.type !== 'application/pdf') {
      setResumeError('Only PDF files are allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setResumeError('File size must be under 10MB')
      return
    }
    setResumeFile(file)
  }

  const handleApply = async () => {
    if (!user) { navigate('/login'); return }

    if (!resumeFile) {
      setError('Please upload your resume before applying')
      return
    }

    setApplying(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('coverLetter', coverLetter)
      formData.append('resume', resumeFile)

      const res = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/applications/' + id, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setApplied(true)
        setShowApplyForm(false)
        setSuccess('Application submitted successfully!')
      } else {
        setError(data.message || 'Failed to apply')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    }
    setApplying(false)
  }

  if (loading) return (
    <div style={{ background: 'var(--primary-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--gray-text)', fontSize: '1rem' }}>Loading job details...</div>
    </div>
  )

  if (!job) return (
    <div style={{ background: 'var(--primary-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😕</div>
        <h5 style={{ color: 'white' }}>Job not found</h5>
        <button className="btn-teal" onClick={() => navigate('/jobs')}
          style={{ padding: '10px 24px', borderRadius: '8px', marginTop: '16px' }}>
          Back to Jobs
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--primary-dark)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">

        {/* Back Button */}
        <button onClick={() => navigate('/jobs')} style={{
          background: 'transparent', border: '1px solid var(--border-color)',
          color: 'var(--gray-text)', padding: '8px 18px', borderRadius: '8px',
          cursor: 'pointer', fontSize: '0.85rem', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Back to Jobs
        </button>

        <div className="row">

          {/* Left — Job Details */}
          <div className="col-lg-8 mb-4">

            {/* Job Header Card */}
            <div style={{
              background: 'var(--card-dark)', border: '1px solid var(--border-color)',
              borderRadius: '12px', padding: '32px', marginBottom: '20px',
              borderTop: '3px solid var(--teal-btn)',
            }}>
              <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px' }}>
                {job.title}
              </h1>
              <p style={{ color: 'var(--green-accent)', fontSize: '1rem', fontWeight: '600', marginBottom: '20px' }}>
                🏢 {job.company?.companyName || 'N/A'}
              </p>

              {/* Tags Row */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {[
                  { label: '📍 ' + (job.location || 'N/A') },
                  { label: '💼 ' + job.jobType },
                  { label: '🏷️ ' + job.category },
                  { label: '👥 ' + job.applicantsCount + ' Applicants' },
                ].map((tag, i) => (
                  <span key={i} style={{
                    background: 'rgba(26,92,92,0.2)', border: '1px solid var(--border-color)',
                    color: 'var(--gray-text)', borderRadius: '50px',
                    padding: '6px 14px', fontSize: '0.82rem',
                  }}>
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Salary & Deadline */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {job.salary?.min > 0 && (
                  <div style={{
                    background: 'rgba(107,143,62,0.1)', border: '1px solid rgba(107,143,62,0.3)',
                    borderRadius: '8px', padding: '10px 16px',
                  }}>
                    <div style={{ color: 'var(--gray-text)', fontSize: '0.75rem', marginBottom: '2px' }}>Salary Range</div>
                    <div style={{ color: 'var(--green-accent)', fontWeight: '700', fontSize: '0.95rem' }}>
                      {job.salary.currency} {job.salary.min.toLocaleString()} — {job.salary.max.toLocaleString()}
                    </div>
                  </div>
                )}
                <div style={{
                  background: 'rgba(26,92,92,0.1)', border: '1px solid rgba(26,92,92,0.3)',
                  borderRadius: '8px', padding: '10px 16px',
                }}>
                  <div style={{ color: 'var(--gray-text)', fontSize: '0.75rem', marginBottom: '2px' }}>Application Deadline</div>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>
                    📅 {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{
              background: 'var(--card-dark)', border: '1px solid var(--border-color)',
              borderRadius: '12px', padding: '28px', marginBottom: '20px',
            }}>
              <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '16px' }}>Job Description</h5>
              <p style={{ color: 'var(--gray-text)', fontSize: '0.9rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div style={{
                background: 'var(--card-dark)', border: '1px solid var(--border-color)',
                borderRadius: '12px', padding: '28px', marginBottom: '20px',
              }}>
                <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '16px' }}>Requirements</h5>
                <p style={{ color: 'var(--gray-text)', fontSize: '0.9rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                  {job.requirements}
                </p>
              </div>
            )}

            {/* Company Info */}
            {job.company?.description && (
              <div style={{
                background: 'var(--card-dark)', border: '1px solid var(--border-color)',
                borderRadius: '12px', padding: '28px',
              }}>
                <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '16px' }}>About the Company</h5>
                <p style={{ color: 'var(--gray-text)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                  {job.company.description}
                </p>
                {job.company.website && (
                  <a href={job.company.website} target="_blank" rel="noreferrer"
                    style={{ color: 'var(--green-accent)', fontSize: '0.85rem' }}>
                    🌐 Visit Website
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right — Apply Card */}
          <div className="col-lg-4">
            <div style={{
              background: 'var(--card-dark)', border: '1px solid var(--border-color)',
              borderRadius: '12px', padding: '28px', position: 'sticky', top: '80px',
            }}>
              <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '20px' }}>Apply for this Job</h5>

              {/* Success Message */}
              {success && (
                <div style={{
                  background: 'rgba(56,161,105,0.1)', border: '1px solid rgba(56,161,105,0.4)',
                  borderRadius: '8px', padding: '12px', marginBottom: '16px',
                  color: '#68d391', fontSize: '0.88rem',
                }}>
                  ✅ {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div style={{
                  background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.4)',
                  borderRadius: '8px', padding: '12px', marginBottom: '16px',
                  color: '#fc8181', fontSize: '0.88rem',
                }}>
                  ❌ {error}
                </div>
              )}

              {applied ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
                  <p style={{ color: 'var(--green-accent)', fontWeight: '600', fontSize: '0.9rem' }}>
                    Application Submitted!
                  </p>
                  <button onClick={() => navigate('/seeker/applications')}
                    style={{
                      marginTop: '12px', background: 'transparent',
                      border: '1px solid var(--border-color)', color: 'var(--gray-text)',
                      padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem',
                    }}>
                    View My Applications
                  </button>
                </div>
              ) : !showApplyForm ? (
                <div>
                  {user?.role === 'jobseeker' ? (
                    <button className="btn-teal" onClick={() => setShowApplyForm(true)}
                      style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '0.95rem' }}>
                      Apply Now →
                    </button>
                  ) : user?.role === 'employer' ? (
                    <p style={{ color: 'var(--gray-text)', fontSize: '0.85rem', textAlign: 'center' }}>
                      Employers cannot apply for jobs
                    </p>
                  ) : (
                    <div>
                      <button className="btn-teal" onClick={() => navigate('/login')}
                        style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '10px' }}>
                        Login to Apply
                      </button>
                      <button onClick={() => navigate('/register')} style={{
                        width: '100%', padding: '11px', borderRadius: '8px', fontSize: '0.88rem',
                        background: 'transparent', border: '1px solid var(--border-color)',
                        color: 'var(--gray-text)', cursor: 'pointer',
                      }}>
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>

                  {/* Cover Letter */}
                  <label style={{ color: 'var(--gray-text)', fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write a short cover letter explaining why you are a good fit for this role..."
                    className="form-control-custom"
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    style={{ resize: 'vertical', marginBottom: '16px' }}
                  />

                  {/* Resume Upload */}
                  <label style={{ color: 'var(--gray-text)', fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>
                    Upload Resume <span style={{ color: '#e53e3e' }}>*</span>
                  </label>

                  <div
                    style={{
                      border: '2px dashed ' + (resumeFile ? 'var(--teal-btn)' : 'var(--border-color)'),
                      borderRadius: '10px',
                      padding: '20px',
                      textAlign: 'center',
                      marginBottom: '6px',
                      background: resumeFile ? 'rgba(26,92,92,0.1)' : 'transparent',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('resumeInput').click()}
                  >
                    {resumeFile ? (
                      <div>
                        <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>📄</div>
                        <div style={{ color: 'var(--green-accent)', fontSize: '0.85rem', fontWeight: '600' }}>
                          {resumeFile.name}
                        </div>
                        <div style={{ color: 'var(--gray-text)', fontSize: '0.75rem', marginTop: '4px' }}>
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>📁</div>
                        <div style={{ color: 'var(--gray-text)', fontSize: '0.85rem' }}>
                          Click to upload your resume
                        </div>
                        <div style={{ color: 'var(--gray-text)', fontSize: '0.75rem', marginTop: '4px' }}>
                          PDF only • Max 10MB
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    id="resumeInput"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={handleResumeChange}
                  />

                  {resumeError && (
                    <div style={{ color: '#fc8181', fontSize: '0.78rem', marginBottom: '10px' }}>
                      ⚠️ {resumeError}
                    </div>
                  )}

                  {resumeFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setResumeFile(null)
                        document.getElementById('resumeInput').value = ''
                      }}
                      style={{
                        background: 'transparent', border: 'none',
                        color: '#fc8181', fontSize: '0.78rem',
                        cursor: 'pointer', marginBottom: '14px', padding: '0',
                        display: 'block',
                      }}
                    >
                      ✕ Remove file
                    </button>
                  )}

                  <div style={{ marginTop: resumeFile ? '0' : '14px' }}>
                    <button className="btn-teal" onClick={handleApply} disabled={applying}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '10px' }}>
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button onClick={() => {
                      setShowApplyForm(false)
                      setResumeFile(null)
                      setResumeError('')
                      setError('')
                    }} style={{
                      width: '100%', padding: '10px', borderRadius: '8px', fontSize: '0.85rem',
                      background: 'transparent', border: '1px solid var(--border-color)',
                      color: 'var(--gray-text)', cursor: 'pointer',
                    }}>
                      Cancel
                    </button>
                  </div>

                </div>
              )}

              {/* Job Summary */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <h6 style={{ color: 'white', fontSize: '0.88rem', fontWeight: '600', marginBottom: '12px' }}>Job Summary</h6>
                {[
                  { label: 'Posted', value: new Date(job.createdAt).toLocaleDateString() },
                  { label: 'Deadline', value: new Date(job.deadline).toLocaleDateString() },
                  { label: 'Job Type', value: job.jobType },
                  { label: 'Category', value: job.category },
                  { label: 'Location', value: job.location || 'N/A' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>{item.label}</span>
                    <span style={{ color: 'white', fontSize: '0.82rem', fontWeight: '600' }}>{item.value}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
