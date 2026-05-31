import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('token', tokenData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Check if user is logged in
  const isLoggedIn = !!user

  // Check role
  const isAdmin = user?.role === 'admin'
  const isEmployer = user?.role === 'employer'
  const isJobSeeker = user?.role === 'jobseeker'

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isLoggedIn,
      isAdmin,
      isEmployer,
      isJobSeeker,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
