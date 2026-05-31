import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { isLoggedIn, user, logout, isAdmin, isEmployer, isJobSeeker } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard'
    if (isEmployer) return '/employer/dashboard'
    return '/seeker/dashboard'
  }

  return (
    <nav className='navbar-custom'>
      <div className='container'>
        <div className='d-flex align-items-center justify-content-between'>

          {/* Logo */}
          <Link to='/' className='d-flex align-items-center gap-3 text-decoration-none'>
            <div style={{
              background: 'linear-gradient(135deg, #6b8f3e 0%, #1a5c5c 100%)',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(107,143,62,0.4)',
            }}>
              <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24'
                fill='none' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <rect x='2' y='7' width='20' height='14' rx='2' ry='2'></rect>
                <path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'></path>
              </svg>
            </div>
            <div>
              <div className='navbar-brand-text'>Job Portal System</div>
              <div className='navbar-brand-sub'>Find Your Dream Job</div>
            </div>
          </Link>

          {/* Nav Links */}
          <div className='d-none d-md-flex align-items-center'>
            <Link to='/' className='nav-link-custom'>Home</Link>
            <Link to='/jobs' className='nav-link-custom'>Find Jobs</Link>
            <span
  className='nav-link-custom'
  style={{ cursor: 'pointer' }}
  onClick={() => {
    if (window.location.pathname !== '/') {
      window.location.href = '/#success'
    } else {
      const el = document.getElementById('success')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }}
>
  Success Stories
</span>
            {isLoggedIn && (
              <Link to={getDashboardLink()} className='nav-link-custom'>Dashboard</Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className='d-flex align-items-center gap-2'>
            {isLoggedIn ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(26,92,92,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--teal-btn)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'white',
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontSize: '0.82rem', fontWeight: '600' }}>
                      {user?.name}
                    </div>
                    <div style={{ color: 'var(--green-accent)', fontSize: '0.72rem', textTransform: 'capitalize' }}>
                      {user?.role}
                    </div>
                  </div>
                </div>
                <button
                  className='btn-signin'
                  onClick={handleLogout}
                  style={{ fontSize: '0.85rem', padding: '7px 16px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className='btn-signin'
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
                <button
                  className='btn-signup'
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
