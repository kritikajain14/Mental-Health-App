import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        
        try {
          await fetchProfile(storedToken)
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const fetchProfile = async (authToken = token) => {
    try {
      const response = await fetch('http://localhost:3000/api/chat/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        return data
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      throw error
    }
  }

  const login = async (newToken, userData) => {
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    
    try {
      await fetchProfile(newToken)
    } catch (error) {
      console.error('Error fetching profile after login:', error)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setProfile(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const value = {
    user,
    token,
    profile,
    loading,
    login,
    logout,
    fetchProfile,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext