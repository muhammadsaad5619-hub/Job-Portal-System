import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='footer-custom'>
      <div className='container'>
        <div className='row'>

          {/* Brand Column */}
          <div className='col-lg-3 col-md-6 mb-4'>
            <div className='d-flex align-items-center gap-2 mb-3'>
              <div style={{
                background: 'var(--green-accent)',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.85rem',
                color: 'white'
              }}>
                JPS
              </div>
              <div className='footer-brand'>Job Portal System</div>
            </div>
            <p className='footer-desc'>
              Pakistan's premier platform for job opportunities, connecting talented individuals with top employers across the country.
            </p>
            {/* Social Icons */}
            <div>
              <a href='#' className='footer-social'>f</a>
              <a href='#' className='footer-social'>t</a>
              <a href='#' className='footer-social'>in</a>
              <a href='#' className='footer-social'>ig</a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className='col-lg-3 col-md-6 mb-4'>
            <h6 className='footer-heading'>For Job Seekers</h6>
            <Link to='/jobs' className='footer-link'>Browse Jobs</Link>
            <Link to='/jobs' className='footer-link'>Browse Categories</Link>
            <Link to='/register' className='footer-link'>Job Alerts</Link>
            <Link to='/register' className='footer-link'>Career Resources</Link>
            <Link to='/register' className='footer-link'>Resume Builder</Link>
          </div>

          {/* Company */}
          <div className='col-lg-3 col-md-6 mb-4'>
            <h6 className='footer-heading'>Company</h6>
            <Link to='/' className='footer-link'>About Us</Link>
            <Link to='/' className='footer-link'>Contact</Link>
            <Link to='/' className='footer-link'>FAQs</Link>
            <Link to='/' className='footer-link'>Privacy Policy</Link>
            <Link to='/' className='footer-link'>Terms of Service</Link>
          </div>

          {/* Get In Touch */}
          <div className='col-lg-3 col-md-6 mb-4'>
            <h6 className='footer-heading'>Get In Touch</h6>
            <p className='footer-link'>
              📞 +92-51-1234567
              <br />
              <span style={{ fontSize: '0.78rem' }}>Mon-Fri 8:30am-4:30pm</span>
            </p>
            <p className='footer-link'>
              ✉️ info@jobportalsystem.pk
            </p>
            <p className='footer-link'>
              📍 Lahore, Punjab, Pakistan
            </p>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className='footer-bottom d-flex justify-content-between align-items-center flex-wrap gap-2'>
          <span>© 2026 Job Portal System. All rights reserved.</span>
          <span>🔒 Secured & Verified</span>
        </div>

      </div>
    </footer>
  )
}

export default Footer