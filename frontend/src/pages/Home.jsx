import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const features = [
    {
      img: 'https://cdn-icons-png.flaticon.com/512/2920/2920244.png',
      title: 'Verified Jobs',
      desc: 'All postings are authenticated and verified'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/1827/1827392.png',
      title: 'Instant Alerts',
      desc: 'Get notified immediately about new jobs'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      title: 'Easy Apply',
      desc: 'Simple one-click application process'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/3176/3176366.png',
      title: 'Career Growth',
      desc: 'Build and advance your professional future'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/1698/1698535.png',
      title: 'Need Help?',
      desc: 'Our support team is here to assist you'
    },
  ]

  const successStories = [
    {
      name: 'Ali Ahmed',
      role: 'Senior Officer',
      dept: 'Government Department',
      text: '"The Job Portal System made my dream of working in a top organization come true. The application process was smooth and transparent."',
    },
    {
      name: 'Fatima Khan',
      role: 'Assistant Director',
      dept: 'Public Sector Organization',
      text: '"I was able to track my application status in real-time and received timely notifications. The portal\'s user-friendly interface made everything so easy!"',
    },
    {
      name: 'Hassan Raza',
      role: 'Project Manager',
      dept: 'Private Company',
      text: '"Finally, a merit-based system that values qualifications and experience. The portal eliminated the hassle of physical applications and long queues."',
    },
  ]

  const topJobs = [
    {
      title: 'Software Engineer',
      company: 'Systems Limited',
      deadline: '06/15/2026',
      location: 'Lahore',
      type: 'Full-Time',
      vacancies: 5,
      tag: 'CS / SE',
      tagColor: '#3182ce',
    },
    {
      title: 'AI / ML Engineer',
      company: 'Arbisoft',
      deadline: '06/20/2026',
      location: 'Islamabad',
      type: 'Full-Time',
      vacancies: 3,
      tag: 'AI / ML',
      tagColor: '#805ad5',
    },
    {
      title: 'Business Analyst',
      company: 'Habib Bank Limited',
      deadline: '06/10/2026',
      location: 'Karachi',
      type: 'Full-Time',
      vacancies: 4,
      tag: 'BBA',
      tagColor: '#d69e2e',
    },
    {
      title: 'Full Stack Developer',
      company: 'NetSol Technologies',
      deadline: '06/25/2026',
      location: 'Lahore',
      type: 'Full-Time',
      vacancies: 6,
      tag: 'CS / SE',
      tagColor: '#3182ce',
    },
    {
      title: 'Data Scientist',
      company: 'Folio3 Software',
      deadline: '06/30/2026',
      location: 'Karachi',
      type: 'Full-Time',
      vacancies: 2,
      tag: 'AI / Data',
      tagColor: '#805ad5',
    },
    {
      title: 'Marketing Manager',
      company: 'Unilever Pakistan',
      deadline: '06/18/2026',
      location: 'Karachi',
      type: 'Full-Time',
      vacancies: 2,
      tag: 'BBA / MBA',
      tagColor: '#d69e2e',
    },
    {
      title: 'Cybersecurity Analyst',
      company: 'PTCL Group',
      deadline: '07/01/2026',
      location: 'Islamabad',
      type: 'Full-Time',
      vacancies: 3,
      tag: 'CS / Security',
      tagColor: '#e53e3e',
    },
    {
      title: 'Assistant Manager Finance',
      company: 'Quaid-E-Azam Solar Power',
      deadline: '05/04/2026',
      location: 'Lahore',
      type: 'Fixed-Pay',
      vacancies: 1,
      tag: 'Finance',
      tagColor: '#38a169',
    },
  ]

  return (
    <div>

      {/* ===== Hero Section ===== */}
      <section className='hero-section'>
        <div className='container'>
          <div className='row align-items-center'>

            {/* Left Side */}
            <div className='col-lg-6 mb-5 mb-lg-0'>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(107,143,62,0.15)',
                border: '1px solid var(--green-accent)',
                borderRadius: '50px',
                padding: '6px 16px',
                marginBottom: '24px',
              }}>
                <span style={{ color: 'var(--green-accent)', fontSize: '0.8rem', fontWeight: '600' }}>
                  🇵🇰 Pakistan's #1 Job Portal
                </span>
              </div>

              <h1 className='hero-title' style={{ fontSize: '2.8rem' }}>
                Job Portal <span className='hero-title-green'>System</span>
              </h1>

              <p className='hero-subtitle'>
                Pakistan's trusted platform connecting talented professionals with top
                government and private employers. Search, apply, and track your
                applications — all in one place, with full transparency and ease.
              </p>

              <div className='d-flex gap-4 mb-4'>
                <div>
                  <div style={{ color: 'var(--green-accent)', fontSize: '1.4rem', fontWeight: '700' }}>5000+</div>
                  <div style={{ color: 'var(--gray-text)', fontSize: '0.8rem' }}>Active Jobs</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                  <div style={{ color: 'var(--green-accent)', fontSize: '1.4rem', fontWeight: '700' }}>1200+</div>
                  <div style={{ color: 'var(--gray-text)', fontSize: '0.8rem' }}>Companies</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                  <div style={{ color: 'var(--green-accent)', fontSize: '1.4rem', fontWeight: '700' }}>50K+</div>
                  <div style={{ color: 'var(--gray-text)', fontSize: '0.8rem' }}>Job Seekers</div>
                </div>
              </div>

              <button className='btn-search' onClick={() => navigate('/jobs')}>
                🔍 Start Job Search →
              </button>
            </div>

            {/* Right Side - Feature Cards */}
            <div className='col-lg-6'>
              <div className='row'>
                {features.map((feature, index) => (
                  <div className='col-6 mb-3' key={index}>
                    <div className='feature-card'>
                      <div className='feature-icon'>
                        <img
                          src={feature.img}
                          alt={feature.title}
                          style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                        />
                      </div>
                      <h6>{feature.title}</h6>
                      <p>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== Top Jobs Section ===== */}
      <section style={{ background: 'var(--secondary-dark)', padding: '70px 0' }}>
        <div className='container'>
          <h2 className='section-title'>OUR <span>TOP</span> JOBS</h2>
          <p className='section-subtitle'>Explore top opportunities across IT, Business, Finance and more</p>

          <div className='text-center mb-4'>
            <button className='tab-btn active'>All</button>
            <button className='tab-btn'>Government</button>
            <button className='tab-btn'>Private</button>
            <button className='tab-btn'>Overseas</button>
          </div>

          <div className='row'>
            {topJobs.map((job, index) => (
              <div className='col-lg-3 col-md-6 mb-4 d-flex' key={index}>
                <div
                  style={{
                    background: 'var(--card-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '24px',
                    borderLeft: '4px solid var(--teal-btn)',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Tag only - no logo */}
                  <div className='d-flex justify-content-end mb-3'>
                    <span style={{
                      background: job.tagColor + '22',
                      color: job.tagColor,
                      border: `1px solid ${job.tagColor}55`,
                      borderRadius: '50px',
                      padding: '4px 14px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                    }}>
                      {job.tag}
                    </span>
                  </div>

                  {/* Job Title */}
                  <div style={{
                    color: 'var(--green-accent)',
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    marginBottom: '6px',
                    lineHeight: '1.35',
                  }}>
                    {job.title}
                  </div>

                  {/* Company */}
                  <div style={{
                    color: 'var(--gray-text)',
                    fontSize: '0.88rem',
                    marginBottom: '16px',
                    fontWeight: '500',
                  }}>
                    {job.company}
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)', margin: '0 0 16px' }} />

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: 'var(--gray-text)', fontSize: '0.85rem' }}>Deadline</span>
                      <span style={{ color: 'var(--white)', fontSize: '0.85rem', fontWeight: '600' }}>{job.deadline}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: 'var(--gray-text)', fontSize: '0.85rem' }}>Location</span>
                      <span style={{ color: 'var(--white)', fontSize: '0.85rem', fontWeight: '600' }}>{job.location}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: 'var(--gray-text)', fontSize: '0.85rem' }}>Type</span>
                      <span style={{ color: 'var(--white)', fontSize: '0.85rem', fontWeight: '600' }}>{job.type}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <span style={{ color: 'var(--gray-text)', fontSize: '0.85rem' }}>Vacancies</span>
                      <span style={{ color: 'var(--green-accent)', fontSize: '0.85rem', fontWeight: '700' }}>{job.vacancies} Open</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className='d-flex gap-2 mt-auto'>
                    <button
                      className='btn-teal'
                      onClick={() => navigate('/jobs')}
                      style={{ flex: 1, padding: '10px', fontSize: '0.86rem', borderRadius: '8px' }}
                    >
                      View Job
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '0.86rem',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: '1px solid var(--teal-btn)',
                        color: 'var(--white)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-btn)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Quick Apply
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className='text-center mt-3'>
            <button
              className='btn-teal'
              onClick={() => navigate('/jobs')}
              style={{ padding: '12px 40px', fontSize: '1rem' }}
            >
              View All Jobs →
            </button>
          </div>
        </div>
      </section>

      {/* ===== Success Stories Section ===== */}
      <section id='success' style={{ background: 'var(--primary-dark)', padding: '70px 0' }}>
        <div className='container'>
          <h2 className='section-title'><span>Success</span> Stories</h2>
          <p className='section-subtitle'>Hear from those who found their dream jobs through our platform</p>

          <div className='row'>
            {successStories.map((story, index) => (
              <div className='col-lg-4 col-md-6 mb-4' key={index}>
                <div className='story-card'>
                  <div className='story-stars'>★★★★★</div>
                  <p className='story-text'>{story.text}</p>
                  <div className='story-author'>
                    <div className='story-avatar'>👤</div>
                    <div>
                      <div className='story-name'>{story.name}</div>
                      <div className='story-role'>{story.role}</div>
                      <div className='story-role'>{story.dept}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Get Started Section ===== */}
      <section style={{
        background: 'var(--green-accent)',
        padding: '50px 0',
        borderRadius: '30px 30px 0 0',
      }}>
        <div className='container text-center'>
          <h3 style={{ color: 'white', marginBottom: '20px', fontWeight: '700' }}>
            Ready to Start Your Career Journey?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '30px', fontSize: '0.95rem' }}>
            Join thousands of professionals who found their dream jobs through Job Portal System
          </p>
          <button
            className='btn-signin'
            onClick={() => navigate('/register')}
            style={{
              padding: '14px 50px',
              fontSize: '1.1rem',
              borderRadius: '50px',
              borderColor: 'var(--primary-dark)',
              color: 'var(--primary-dark)',
            }}
          >
            Get Started Now →
          </button>
        </div>
      </section>

    </div>
  )
}

export default Home