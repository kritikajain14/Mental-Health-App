import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AuthForm = ({ isLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        login(data.token, data.user)
        navigate('/home')
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-gray-900 p-8 rounded-2xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
        </button>
      </div>

      <div className="text-center">
        <a
          href={isLogin ? '/register' : '/login'}
          className="text-pink-500 hover:text-pink-400 transition-colors duration-200"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </a>
      </div>
    </form>
  )
}

export default AuthForm