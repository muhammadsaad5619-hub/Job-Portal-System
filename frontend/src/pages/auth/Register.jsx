import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState('jobseeker')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Jobseeker form
  const [seekerData, setSeekerData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Employer form
  const [employerData, setEmployerData] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const r = searchParams.get('role')
    if (r === 'employer' || r === 'jobseeker') setRole(r)
  }, [searchParams])

  const handleSeekerChange = (e) => {
    setSeekerData({ ...seekerData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleEmployerChange = (e) => {
    setEmployerData({ ...employerData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const data = role === 'employer' ? employerData : seekerData

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (data.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: role === 'employer' ? employerData.organizationName : seekerData.name,
        email: data.email,
        password: data.password,
        role,
      }

      const response = await fetch('https://job-portal-system-production-cd99.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Registration failed')
        setLoading(false)
        return
      }

      login(result, result.token)

      if (result.role === 'employer') navigate('/employer/dashboard')
      else navigate('/seeker/dashboard')

    } catch (err) {
      setError('Server error. Please try again.')
      setLoading(false)
    }
  }

  const passwordValue = role === 'employer' ? employerData.password : seekerData.password

  return (
    <div className='form-section'>
      <div className='form-card' style={{ maxWidth: '520px' }}>

        {/* Logo */}
        <div className='text-center mb-4'>
          <div style={{
            background: 'linear-gradient(135deg, #6b8f3e 0%, #1a5c5c 100%)',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 20px rgba(107,143,62,0.4)',
          }}>
            <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'
              fill='none' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <rect x='2' y='7' width='20' height='14' rx='2' ry='2'></rect>
              <path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'></path>
            </svg>
          </div>
          <h2 className='form-title'>
            {role === 'employer' ? 'Welcome to Job Portal System!' : 'Create Your Account'}
          </h2>
          <p className='form-subtitle'>
            {role === 'employer' ? 'Sign up as an Employer' : 'Sign up as a Job Seeker'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className='d-flex gap-2 mb-4'>
          <button
            type='button'
            onClick={() => { setRole('jobseeker'); setError('') }}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '8px',
              border: role === 'jobseeker' ? '2px solid var(--teal-btn)' : '1px solid var(--border-color)',
              background: role === 'jobseeker' ? 'rgba(26,92,92,0.25)' : 'transparent',
              color: role === 'jobseeker' ? 'white' : 'var(--gray-text)',
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontWeight: role === 'jobseeker' ? '600' : '400',
              transition: 'all 0.3s',
            }}
          >
            👤 Job Seeker
          </button>
          <button
            type='button'
            onClick={() => { setRole('employer'); setError('') }}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '8px',
              border: role === 'employer' ? '2px solid var(--teal-btn)' : '1px solid var(--border-color)',
              background: role === 'employer' ? 'rgba(26,92,92,0.25)' : 'transparent',
              color: role === 'employer' ? 'white' : 'var(--gray-text)',
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontWeight: role === 'employer' ? '600' : '400',
              transition: 'all 0.3s',
            }}
          >
            🏢 Employer
          </button>
        </div>

        {/* Info Box for Employer */}
        {role === 'employer' && (
          <div style={{
            background: 'rgba(26,92,92,0.15)',
            border: '1px solid rgba(26,92,92,0.4)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            color: 'var(--gray-text)',
            lineHeight: '1.6',
          }}>
            ✅ As an <span style={{ color: 'var(--green-accent)', fontWeight: '600' }}>Employer</span> you can:
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
              <li>Create and manage your company profile</li>
              <li>Post job openings for candidates</li>
              <li>View and manage all applications</li>
            </ul>
          </div>
        )}

        {/* Info Box for Job Seeker */}
        {role === 'jobseeker' && (
          <div style={{
            background: 'rgba(107,143,62,0.1)',
            border: '1px solid rgba(107,143,62,0.35)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            color: 'var(--gray-text)',
            lineHeight: '1.6',
          }}>
            ✅ As a <span style={{ color: 'var(--green-accent)', fontWeight: '600' }}>Job Seeker</span> you can:
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
              <li>Browse and search thousands of jobs</li>
              <li>Apply to jobs with one click</li>
              <li>Track your application status in real-time</li>
            </ul>
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
            ⚠️ {error}
          </div>
        )}

        {/* ===== EMPLOYER FORM ===== */}
        {role === 'employer' && (
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: '16px' }}>
              <label className='form-label-custom'>Organization Name</label>
              <input
                type='text'
                name='organizationName'
                className='form-control-custom'
                placeholder='Enter your organization name'
                value={employerData.organizationName}
                onChange={handleEmployerChange}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className='form-label-custom'>Email Address</label>
              <input
                type='email'
                name='email'
                className='form-control-custom'
                placeholder='Enter organization email'
                value={employerData.email}
                onChange={handleEmployerChange}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className='form-label-custom'>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className='form-control-custom'
                  placeholder='Min. 6 characters'
                  value={employerData.password}
                  onChange={handleEmployerChange}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button type='button' onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-text)', cursor: 'pointer', fontSize: '1rem', padding: '0' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label className='form-label-custom'>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name='confirmPassword'
                  className='form-control-custom'
                  placeholder='Re-enter your password'
                  value={employerData.confirmPassword}
                  onChange={handleEmployerChange}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button type='button' onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-text)', cursor: 'pointer', fontSize: '1rem', padding: '0' }}>
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Password Strength */}
            {employerData.password && (
              <div style={{ marginBottom: '20px', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '3px', borderRadius: '2px',
                      background: employerData.password.length >= i * 3
                        ? i <= 1 ? '#e53e3e' : i <= 2 ? '#d69e2e' : i <= 3 ? '#3182ce' : '#38a169'
                        : 'var(--border-color)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: employerData.password.length < 4 ? '#e53e3e' : employerData.password.length < 7 ? '#d69e2e' : employerData.password.length < 10 ? '#3182ce' : '#38a169',
                }}>
                  {employerData.password.length < 4 ? 'Weak' : employerData.password.length < 7 ? 'Fair' : employerData.password.length < 10 ? 'Good' : 'Strong'} password
                </span>
              </div>
            )}

            <button type='submit' className='btn-teal' disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '1rem', borderRadius: '8px', fontWeight: '600', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
              {loading ? 'Creating Account...' : 'Create Employer Account'}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--gray-text)', fontSize: '0.78rem', margin: '0 0 12px', lineHeight: '1.5' }}>
              By registering, you agree to our{' '}
              <span style={{ color: 'var(--green-accent)', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: 'var(--green-accent)', cursor: 'pointer' }}>Privacy Policy</span>
            </p>

            <p style={{ textAlign: 'center', color: 'var(--gray-text)', fontSize: '0.88rem', margin: 0 }}>
              Already have an account?{' '}
              <Link to='/login' style={{ color: 'var(--green-accent)', fontWeight: '600' }}>Sign In</Link>
            </p>

          </form>
        )}

        {/* ===== JOB SEEKER FORM ===== */}
        {role === 'jobseeker' && (
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: '16px' }}>
              <label className='form-label-custom'>Full Name</label>
              <input
                type='text'
                name='name'
                className='form-control-custom'
                placeholder='Enter your full name'
                value={seekerData.name}
                onChange={handleSeekerChange}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className='form-label-custom'>Email Address</label>
              <input
                type='email'
                name='email'
                className='form-control-custom'
                placeholder='Enter your email'
                value={seekerData.email}
                onChange={handleSeekerChange}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className='form-label-custom'>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className='form-control-custom'
                  placeholder='Min. 6 characters'
                  value={seekerData.password}
                  onChange={handleSeekerChange}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button type='button' onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-text)', cursor: 'pointer', fontSize: '1rem', padding: '0' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label className='form-label-custom'>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name='confirmPassword'
                  className='form-control-custom'
                  placeholder='Re-enter your password'
                  value={seekerData.confirmPassword}
                  onChange={handleSeekerChange}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button type='button' onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-text)', cursor: 'pointer', fontSize: '1rem', padding: '0' }}>
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Password Strength */}
            {seekerData.password && (
              <div style={{ marginBottom: '20px', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '3px', borderRadius: '2px',
                      background: seekerData.password.length >= i * 3
                        ? i <= 1 ? '#e53e3e' : i <= 2 ? '#d69e2e' : i <= 3 ? '#3182ce' : '#38a169'
                        : 'var(--border-color)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: seekerData.password.length < 4 ? '#e53e3e' : seekerData.password.length < 7 ? '#d69e2e' : seekerData.password.length < 10 ? '#3182ce' : '#38a169',
                }}>
                  {seekerData.password.length < 4 ? 'Weak' : seekerData.password.length < 7 ? 'Fair' : seekerData.password.length < 10 ? 'Good' : 'Strong'} password
                </span>
              </div>
            )}

            <button type='submit' className='btn-teal' disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '1rem', borderRadius: '8px', fontWeight: '600', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
              {loading ? 'Creating Account...' : 'Create Job Seeker Account'}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--gray-text)', fontSize: '0.78rem', margin: '0 0 12px', lineHeight: '1.5' }}>
              By registering, you agree to our{' '}
              <span style={{ color: 'var(--green-accent)', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: 'var(--green-accent)', cursor: 'pointer' }}>Privacy Policy</span>
            </p>

            <p style={{ textAlign: 'center', color: 'var(--gray-text)', fontSize: '0.88rem', margin: 0 }}>
              Already have an account?{' '}
              <Link to='/login' style={{ color: 'var(--green-accent)', fontWeight: '600' }}>Sign In</Link>
            </p>

          </form>
        )}

      </div>
    </div>
  )
}

export default Register
