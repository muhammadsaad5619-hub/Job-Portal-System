import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      // Save to AuthContext
      login(data, data.token)

      // Redirect based on role
      if (data.role === 'admin') navigate('/admin/dashboard')
      else if (data.role === 'employer') navigate('/employer/dashboard')
      else navigate('/seeker/dashboard')

    } catch (err) {
      setError('Server error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className='form-section'>
      <div className='form-card'>

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
          <h2 className='form-title'>Welcome Back</h2>
          <p className='form-subtitle'>Sign in to your Job Portal System account</p>
        </div>

        {/* Error Message */}
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

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label className='form-label-custom'>Email Address</label>
            <input
              type='email'
              name='email'
              className='form-control-custom'
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '10px' }}>
            <label className='form-label-custom'>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                className='form-control-custom'
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--gray-text)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <span style={{ color: 'var(--green-accent)', fontSize: '0.85rem', cursor: 'pointer' }}>
              Forgot Password?
            </span>
          </div>

          {/* Submit */}
          <button
            type='submit'
            className='btn-teal'
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '1rem',
              borderRadius: '8px',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>or register as</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        {/* Role Quick Register Buttons */}
        <div className='d-flex gap-2 mb-4'>
          <button
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--gray-text)',
              fontSize: '0.82rem',
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
            onClick={() => navigate('/register?role=jobseeker')}
          >
            👤 Job Seeker
          </button>
          <button
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--gray-text)',
              fontSize: '0.82rem',
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
            onClick={() => navigate('/register?role=employer')}
          >
            🏢 Employer
          </button>
        </div>

        {/* Register Link */}
        <p style={{ textAlign: 'center', color: 'var(--gray-text)', fontSize: '0.88rem', margin: 0 }}>
          Don't have an account?{' '}
          <Link to='/register' style={{ color: 'var(--green-accent)', fontWeight: '600' }}>
            Create Account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login