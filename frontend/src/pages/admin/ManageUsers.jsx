import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ManageUsers = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [filter, setFilter] = useState('all')

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
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) setUsers(data.data)
    } catch (err) {
      setError('Failed to load users')
    }
    setLoading(false)
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setDeletingId(userId)
    try {
      const res = await fetch('http://localhost:5000/api/admin/users/' + userId, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.filter(u => u._id !== userId))
      } else {
        setError(data.message || 'Failed to delete user')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    }
    setDeletingId(null)
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users/' + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.map(u =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u
        ))
      }
    } catch (err) {
      setError('Failed to update user status')
    }
  }

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true
    return u.role === filter
  })

  const roleColor = (role) => {
    if (role === 'admin') return { bg: 'rgba(229,62,62,0.15)', color: '#fc8181', border: 'rgba(229,62,62,0.3)' }
    if (role === 'employer') return { bg: 'rgba(49,130,206,0.15)', color: '#63b3ed', border: 'rgba(49,130,206,0.3)' }
    return { bg: 'rgba(56,161,105,0.15)', color: '#68d391', border: 'rgba(56,161,105,0.3)' }
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
            Manage Users
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem' }}>
            View, activate, deactivate or delete users
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Users', value: users.length, color: '#63b3ed' },
            { label: 'Job Seekers', value: users.filter(u => u.role === 'jobseeker').length, color: '#68d391' },
            { label: 'Employers', value: users.filter(u => u.role === 'employer').length, color: '#f6ad55' },
            { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#fc8181' },
            { label: 'Active', value: users.filter(u => u.isActive).length, color: '#76e4f7' },
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

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['all', 'jobseeker', 'employer', 'admin'].map(f => (
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
              {f === 'all' ? 'All Users' : f === 'jobseeker' ? 'Job Seekers' : f === 'employer' ? 'Employers' : 'Admins'}
            </button>
          ))}
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

        {/* Users Table */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
        }}>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-text)' }}>
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👥</div>
              <div style={{ color: 'var(--gray-text)', fontSize: '0.9rem' }}>No users found</div>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                gap: '12px',
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                marginBottom: '8px',
              }}>
                {['NAME', 'EMAIL', 'ROLE', 'STATUS', 'ACTIONS'].map((h, i) => (
                  <span key={i} style={{ color: 'var(--gray-text)', fontSize: '0.78rem', fontWeight: '600' }}>
                    {h}
                  </span>
                ))}
              </div>

              {filteredUsers.map((u, index) => {
                const rc = roleColor(u.role)
                return (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                    gap: '12px',
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center',
                  }}>
                    {/* Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: u.role === 'admin'
                          ? 'linear-gradient(135deg, #e53e3e, #805ad5)'
                          : u.role === 'employer'
                          ? 'linear-gradient(135deg, var(--teal-btn), #3182ce)'
                          : 'linear-gradient(135deg, var(--teal-btn), var(--green-accent))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: 'white',
                        flexShrink: 0,
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ color: 'white', fontSize: '0.88rem', fontWeight: '600' }}>
                        {u.name}
                      </span>
                    </div>

                    {/* Email */}
                    <span style={{ color: 'var(--gray-text)', fontSize: '0.82rem' }}>
                      {u.email}
                    </span>

                    {/* Role */}
                    <span style={{
                      background: rc.bg,
                      color: rc.color,
                      border: '1px solid ' + rc.border,
                      borderRadius: '50px',
                      padding: '3px 12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      display: 'inline-block',
                    }}>
                      {u.role}
                    </span>

                    {/* Status */}
                    <button
                      onClick={() => handleToggleStatus(u._id, u.isActive)}
                      style={{
                        background: u.isActive ? 'rgba(56,161,105,0.15)' : 'rgba(229,62,62,0.15)',
                        color: u.isActive ? '#68d391' : '#fc8181',
                        border: '1px solid ' + (u.isActive ? 'rgba(56,161,105,0.3)' : 'rgba(229,62,62,0.3)'),
                        borderRadius: '50px',
                        padding: '3px 12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>

                    {/* Actions */}
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={deletingId === u._id || u._id === user._id}
                      style={{
                        background: 'rgba(229,62,62,0.1)',
                        border: '1px solid rgba(229,62,62,0.4)',
                        color: '#fc8181',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        cursor: deletingId === u._id || u._id === user._id ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: u._id === user._id ? 0.4 : 1,
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={e => {
                        if (u._id !== user._id) e.currentTarget.style.background = 'rgba(229,62,62,0.25)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(229,62,62,0.1)'
                      }}
                    >
                      {deletingId === u._id ? 'Deleting...' : 'Delete'}
                    </button>

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

export default ManageUsers