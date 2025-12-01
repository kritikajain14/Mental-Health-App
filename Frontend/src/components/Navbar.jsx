import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-black border-b border-pink-500/20 shadow-lg shadow-pink-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-white font-bold text-lg">💖</span>
            </div>
            <div>
              <span className=" font-bold text-xl bg-linear-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                MindCare
              </span>
              <p className="text-gray-400 text-xs">AI Mental Health Companion</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/home"
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive('/home')
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  💬 Chat
                </Link>

                {/* Add this for llogged in users  */}
                <Link
                  to="/tasks"
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive('/tasks')
                      ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  ✅ Tasks
                </Link>


                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive('/profile')
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  👤 Profile
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Hello, <span className="text-pink-400">{user.name}</span></span>
                  <button
                    onClick={handleLogout}
                    className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-2 bg-gray-800/95 rounded-xl mt-2 backdrop-blur-lg border border-gray-700">
              {user ? (
                <>
                  <Link
                    to="/home"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/home')
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                  >
                    💬 Chat
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/profile')
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                  >
                    👤 Profile
                  </Link>

                  {/* Add this in the navigation section for logged-in users */}
                  <Link
                    to="/tasks"
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive('/tasks')
                      ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                  >
                    ✅ Tasks
                  </Link>


                  <div className="px-4 py-3 border-t border-gray-700">
                    <p className="text-gray-400 text-sm">Hello, {user.name}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-all duration-300"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl font-medium transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold text-center transition-all duration-300"
                  >
                    Get Started
                  </Link>


                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar