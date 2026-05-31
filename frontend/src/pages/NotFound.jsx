import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--primary-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px',
    }}>
      <div>
        <div style={{ fontSize: '8rem', fontWeight: '900', color: 'var(--teal-btn)', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: '700', margin: '20px 0 12px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--gray-text)', fontSize: '0.95rem', marginBottom: '32px' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            className="btn-teal"
            onClick={() => navigate('/')}
            style={{ padding: '12px 32px', borderRadius: '8px', fontSize: '0.95rem' }}
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--gray-text)',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound