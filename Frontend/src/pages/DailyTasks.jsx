import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_URL;

const DailyTasks = () => {
  const { user, token } = useAuth()
  const [categories, setCategories] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([])
  const [dailyTasks, setDailyTasks] = useState([])
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0, streak: 0, rewardClaimed: false })
  const [customTask, setCustomTask] = useState('')
  const [showReward, setShowReward] = useState(false)
  const [rewardQuote, setRewardQuote] = useState('')
  const [activeTab, setActiveTab] = useState('select') // 'select' or 'progress'

  useEffect(() => {
    fetchCategories()
    fetchTodayTasks()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('`${API_BASE_URL}/api/tasks/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTodayTasks = async () => {
    try {
      const response = await fetch('`${API_BASE_URL}/api/tasks/today', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setDailyTasks(data.tasks)
      setProgress(data.progress)
      
      // If there are tasks, switch to progress view
      if (data.tasks.length > 0) {
        setActiveTab('progress')
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const toggleTaskSelection = (category, subCategory) => {
    const taskId = `${category}-${subCategory}`
    setSelectedTasks(prev => {
      const isSelected = prev.some(task => task.id === taskId)
      if (isSelected) {
        return prev.filter(task => task.id !== taskId)
      } else {
        return [...prev, { id: taskId, title: subCategory, category, subCategory }]
      }
    })
  }

  const addCustomTask = () => {
    if (customTask.trim()) {
      const newTask = {
        id: `custom-${Date.now()}`,
        title: customTask,
        category: 'Custom',
        subCategory: 'Custom',
        custom: true
      }
      setSelectedTasks(prev => [...prev, newTask])
      setCustomTask('')
    }
  }

  const createDailyTasks = async () => {
    try {
      const response = await fetch('`${API_BASE_URL}/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tasks: selectedTasks })
      })

      if (response.ok) {
        const tasks = await response.json()
        setDailyTasks(tasks)
        setActiveTab('progress')
        setSelectedTasks([])
        fetchTodayTasks()
      }
    } catch (error) {
      console.error('Error creating tasks:', error)
    }
  }

  const toggleTaskCompletion = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDailyTasks(prev => 
          prev.map(task => 
            task._id === taskId ? data.task : task
          )
        )
        setProgress(data.progress)

        // Check if all tasks are completed
        if (data.progress.percentage === 100 && !progress.rewardClaimed) {
          // Show completion alert
          setTimeout(() => {
            // You can add a more sophisticated alert/notification here
          }, 300)
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const addCustomTaskToDaily = async () => {
    if (customTask.trim()) {
      try {
        const response = await fetch('`${API_BASE_URL}/api/tasks/custom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title: customTask })
        })

        if (response.ok) {
          const task = await response.json()
          setDailyTasks(prev => [...prev, task])
          setCustomTask('')
          fetchTodayTasks()
        }
      } catch (error) {
        console.error('Error adding custom task:', error)
      }
    }
  }

  const claimReward = async () => {
    try {
      const response = await fetch('`${API_BASE_URL}/api/tasks/claim-reward', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRewardQuote(data.quote)
        setShowReward(true)
        setProgress(prev => ({ ...prev, rewardClaimed: true }))
      }
    } catch (error) {
      console.error('Error claiming reward:', error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setDailyTasks(prev => prev.filter(task => task._id !== taskId))
        fetchTodayTasks()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const startNewDay = () => {
    setDailyTasks([])
    setProgress({ completed: 0, total: 0, percentage: 0, streak: 0, rewardClaimed: false })
    setActiveTab('select')
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4">
            Daily <span className="gradient-text">Tasks</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Build positive habits and track your daily progress with personalized tasks
          </p>
        </div>

        {/* Progress Overview */}
        {dailyTasks.length > 0 && (
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl mb-8 hover-lift transition-all duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Today's Progress</h3>
                <p className="text-gray-400">
                  {progress.completed} of {progress.total} tasks completed
                  {progress.streak > 0 && <span className="text-pink-400 ml-2">🔥 {progress.streak} day streak!</span>}
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Progress Circle */}
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="3"
                      strokeDasharray={`${progress.percentage}, 100`}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f472b6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{progress.percentage}%</span>
                  </div>
                </div>

                <button
                  onClick={startNewDay}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift"
                >
                  Start New Day
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-linear-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('select')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'select'
                ? 'bg-linear-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            📝 Select Tasks
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'progress'
                ? 'bg-linear-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            📊 Track Progress
          </button>
        </div>

        {/* Task Selection View */}
        {activeTab === 'select' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories Section */}
            <div className="space-y-8">
              {categories.map((category, index) => (
                <div key={index} className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
                    <span className="text-pink-400 text-2xl">
                      {category.name === 'Hygiene' && '🚿'}
                      {category.name === 'Growth' && '🌱'}
                      {category.name === 'Self Help' && '💖'}
                      {category.name === 'Business' && '💼'}
                      {category.name === 'Discipline' && '⚡'}
                    </span>
                    <span>{category.name}</span>
                  </h3>
                  <div className="space-y-3">
                    {category.subCategories.map((subCategory, subIndex) => {
                      const isSelected = selectedTasks.some(task => task.id === `${category.name}-${subCategory}`)
                      return (
                        <button
                          key={subIndex}
                          onClick={() => toggleTaskSelection(category.name, subCategory)}
                          className={`w-full text-left p-4 rounded-2xl transition-all duration-300 hover-lift ${
                            isSelected
                              ? 'bg-linear-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{subCategory}</span>
                            {isSelected && <span className="text-white">✓</span>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Tasks & Custom Task */}
            <div className="space-y-8">
              {/* Custom Task Input */}
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-4">➕ Add Custom Task</h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    placeholder="Enter your custom task..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
                  />
                  <button
                    onClick={addCustomTask}
                    className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Tasks Preview */}
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-4">
                  📋 Selected Tasks ({selectedTasks.length})
                </h3>
                {selectedTasks.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No tasks selected yet. Choose some tasks from the categories!</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedTasks.map((task, index) => (
                      <div key={task.id} className="bg-gray-800 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-700 transition-all duration-300">
                        <div>
                          <p className="text-white font-medium">{task.title}</p>
                          <p className="text-gray-400 text-sm">{task.category}</p>
                        </div>
                        <button
                          onClick={() => setSelectedTasks(prev => prev.filter(t => t.id !== task.id))}
                          className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-500/10 transition-all duration-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTasks.length > 0 && (
                  <button
                    onClick={createDailyTasks}
                    className="w-full mt-6 bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift hover-glow"
                  >
                    🚀 Start My Daily Tasks
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Tracking View */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks List */}
            <div className="lg:col-span-2">
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-6">Today's Tasks</h3>
                
                {dailyTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-400 text-xl mb-4">No tasks for today</p>
                    <p className="text-gray-500 mb-6">Select some tasks to start tracking your progress!</p>
                    <button
                      onClick={() => setActiveTab('select')}
                      className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift"
                    >
                      Select Tasks
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dailyTasks.map((task) => (
                      <div key={task._id} className="bg-gray-800 rounded-2xl p-4 hover:bg-gray-700 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => toggleTaskCompletion(task._id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                task.completed
                                  ? 'bg-pink-500 border-pink-500'
                                  : 'border-gray-500 hover:border-pink-400'
                              }`}
                            >
                              {task.completed && <span className="text-white text-sm">✓</span>}
                            </button>
                            <div>
                              <p className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                                {task.title}
                              </p>
                              <p className="text-gray-400 text-sm">{task.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {task.custom && (
                              <button
                                onClick={() => deleteTask(task._id)}
                                className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Task in Progress View */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4">Add More Tasks</h4>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={customTask}
                      onChange={(e) => setCustomTask(e.target.value)}
                      placeholder="Add a custom task..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTaskToDaily()}
                    />
                    <button
                      onClick={addCustomTaskToDaily}
                      className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Reward Section */}
              {progress.percentage === 100 && (
                <div className="bg-linear-to-br from-yellow-500/10 to-yellow-600/5 rounded-3xl p-6 border border-yellow-500/30 shadow-2xl hover-lift transition-all duration-500">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">🎉 Amazing!</h3>
                  <p className="text-yellow-300 text-center mb-6">
                    You've completed all your daily tasks!
                  </p>
                  
                  {!progress.rewardClaimed ? (
                    <button
                      onClick={claimReward}
                      className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift hover-glow animate-pulse-glow"
                    >
                      🏆 Claim Your Reward!
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-yellow-400 text-sm mb-4">Reward claimed for today!</p>
                      <button
                        onClick={() => setShowReward(true)}
                        className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift border border-yellow-500/30"
                      >
                        View Your Reward Again
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Stats Card */}
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover-lift transition-all duration-500">
                <h3 className="text-xl font-bold text-white mb-6">📈 Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-pink-400 font-bold text-lg">{progress.streak} days 🔥</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tasks Completed</span>
                    <span className="text-green-400 font-bold">{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Completion Rate</span>
                    <span className="text-blue-400 font-bold">{progress.percentage}%</span>
                  </div>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="bg-linear-to-br from-pink-500/10 to-pink-600/5 rounded-3xl p-6 border border-pink-500/20 shadow-2xl hover-lift transition-all duration-500">
                <h3 className="text-xl font-bold text-white mb-4">💫 Daily Motivation</h3>
                <p className="text-gray-300 italic">
                  "Small daily improvements are the key to staggering long-term results."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reward Modal */}
        {showReward && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-yellow-500/30 shadow-2xl max-w-md mx-4 transform scale-100 animate-fade-in">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-yellow-400 mb-4">Congratulations!</h3>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {rewardQuote}
                </p>
                <p className="text-pink-400 mb-6">
                  🔥 You're on a {progress.streak} day streak! Keep it up!
                </p>
                <button
                  onClick={() => setShowReward(false)}
                  className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift"
                >
                  Continue My Journey
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyTasks