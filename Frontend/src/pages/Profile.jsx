import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user, profile, fetchProfile, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [user])

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchProfile()
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    loadProfile()
  }, [fetchProfile])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await updateProfile(formData)
      setMessage('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      setMessage('Error updating profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getToneStats = () => {
    if (!profile?.recentMessages) return {}
    
    const toneStats = {}
    profile.recentMessages.forEach(msg => {
      if (msg.tone) {
        toneStats[msg.tone] = (toneStats[msg.tone] || 0) + 1
      }
    })
    return toneStats
  }

  const toneStats = getToneStats()
  const totalMessages = profile?.recentMessages?.length || 0
  const mostCommonTone = Object.keys(toneStats).reduce((a, b) => toneStats[a] > toneStats[b] ? a : b, '')

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4">
            Your <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage your account and track your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift shadow-lg"
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-2xl ${
                  message.includes('Error') 
                    ? 'bg-red-500/10 border border-red-500/50 text-red-400' 
                    : 'bg-green-500/10 border border-green-500/50 text-green-400'
                } transition-all duration-300`}>
                  {message}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-lg font-medium mb-3">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-lg font-medium mb-3">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-700/50 transition-all duration-300">
                      <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                      <p className="text-white text-2xl font-semibold">{user?.name}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-700/50 transition-all duration-300">
                      <label className="block text-gray-400 text-sm mb-2">Member Since</label>
                      <p className="text-white text-xl">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-700/50 transition-all duration-300">
                      <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                      <p className="text-white text-xl break-all">{user?.email}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-700/50 transition-all duration-300">
                      <label className="block text-gray-400 text-sm mb-2">User ID</label>
                      <p className="text-gray-300 text-sm font-mono">{user?.id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mental Health Insights */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
              <h2 className="text-3xl font-bold text-white mb-8">Mental Health Insights</h2>
              
              {totalMessages > 0 ? (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-linear-to-br from-pink-500/20 to-pink-600/10 rounded-2xl p-6 text-center border border-pink-500/30 hover-lift transition-all duration-300">
                      <p className="text-3xl font-bold text-pink-400">{totalMessages}</p>
                      <p className="text-gray-400 text-sm mt-2">Total Messages</p>
                    </div>
                    <div className="bg-linear-to-br from-purple-500/20 to-purple-600/10 rounded-2xl p-6 text-center border border-purple-500/30 hover-lift transition-all duration-300">
                      <p className="text-3xl font-bold text-purple-400">{Object.keys(toneStats).length}</p>
                      <p className="text-gray-400 text-sm mt-2">Different Moods</p>
                    </div>
                    <div className="bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-2xl p-6 text-center border border-blue-500/30 hover-lift transition-all duration-300">
                      <p className="text-3xl font-bold text-blue-400">
                        {mostCommonTone ? mostCommonTone.charAt(0).toUpperCase() + mostCommonTone.slice(1) : 'N/A'}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">Most Common Mood</p>
                    </div>
                    <div className="bg-linear-to-br from-green-500/20 to-green-600/10 rounded-2xl p-6 text-center border border-green-500/30 hover-lift transition-all duration-300">
                      <p className="text-3xl font-bold text-green-400">
                        {Math.round((profile?.recentMessages?.filter(msg => msg.sender === 'ai').length / totalMessages) * 100)}%
                      </p>
                      <p className="text-gray-400 text-sm mt-2">Support Received</p>
                    </div>
                  </div>

                  {/* Mood Distribution */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6">Mood Distribution</h3>
                    <div className="space-y-4">
                      {Object.entries(toneStats).map(([tone, count]) => {
                        const percentage = Math.round((count / totalMessages) * 100)
                        return (
                          <div key={tone} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-all duration-300">
                            <div className="flex items-center space-x-4">
                              <span className="text-2xl">
                                {tone === 'happy' && '😊'}
                                {tone === 'sad' && '😔'}
                                {tone === 'anxious' && '😰'}
                                {tone === 'calm' && '😌'}
                                {tone === 'angry' && '😠'}
                                {tone === 'tired' && '😴'}
                                {!['happy', 'sad', 'anxious', 'calm', 'angry', 'tired'].includes(tone) && '😐'}
                              </span>
                              <span className="text-white font-medium capitalize">{tone}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-gray-700 rounded-full h-3">
                                <div 
                                  className="bg-linear-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-1000"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-gray-400 font-medium w-12 text-right">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-400 text-xl mb-4">No chat history yet</p>
                  <p className="text-gray-500">Start a conversation with your AI companion to see insights here</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => window.location.href = '/home'}
                  className="w-full bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-4 rounded-2xl font-semibold transition-all duration-300 hover-lift text-left flex items-center space-x-4"
                >
                  <span className="text-2xl">💬</span>
                  <span>Continue Chat</span>
                </button>
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-4 rounded-2xl font-medium transition-all duration-300 text-left flex items-center space-x-4">
                  <span className="text-2xl">📊</span>
                  <span>View Insights</span>
                </button>
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-4 rounded-2xl font-medium transition-all duration-300 text-left flex items-center space-x-4">
                  <span className="text-2xl">⚙️</span>
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-6">Account</h3>
              <div className="space-y-4">
                <button className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 py-4 px-4 rounded-2xl transition-all duration-300 text-left flex items-center space-x-4">
                  <span className="text-2xl">🗑️</span>
                  <span>Delete Account</span>
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800 py-4 px-4 rounded-2xl transition-all duration-300 text-left flex items-center space-x-4"
                >
                  <span className="text-2xl">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Support Resources */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-6">Support Resources</h3>
              <div className="space-y-4 text-sm">
                <a href="#" className=" text-pink-400 hover:text-pink-300 transition-colors duration-200 flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-800">
                  <span className="text-lg">🆘</span>
                  <span>Crisis Help Lines</span>
                </a>
                <a href="#" className=" text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-800">
                  <span className="text-lg">📚</span>
                  <span>Mental Health Resources</span>
                </a>
                <a href="#" className=" text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-800">
                  <span className="text-lg">❓</span>
                  <span>Help & Support</span>
                </a>
                <a href="#" className=" text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-800">
                  <span className="text-lg">📞</span>
                  <span>Contact Us</span>
                </a>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-6">Your Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-500/20 rounded-2xl p-4 text-center border border-pink-500/30">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-pink-400 text-sm font-semibold">First Chat</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4 text-center border border-gray-700">
                  <div className="text-2xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">10 Chats</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4 text-center border border-gray-700">
                  <div className="text-2xl mb-2">💪</div>
                  <p className="text-gray-500 text-sm">Consistent</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4 text-center border border-gray-700">
                  <div className="text-2xl mb-2">🌟</div>
                  <p className="text-gray-500 text-sm">All Moods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile