import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ChatWindow from '../components/ChatWindow'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: '💬',
      title: 'AI-Powered Chat',
      description: 'Have meaningful conversations with our compassionate AI companion that understands and supports you'
    },
    {
      icon: '🎵',
      title: 'Voice Support',
      description: 'Share your thoughts through voice messages for a more natural and comfortable experience'
    },
    {
      icon: '📊',
      title: 'Emotion Analysis',
      description: 'Get real-time insights into your emotional state with advanced tone and mood detection'
    },
    {
      icon: '💡',
      title: 'Daily Task Routines',
      description: 'Stay consistent with simple habits. Track your hygiene, discipline, growth, and wellness tasks every day.'
    },
    {
      icon: '🔒',
      title: 'Safe & Private',
      description: 'Your conversations are confidential and secure in our encrypted environment'
    },
    {
      icon: '🌙',
      title: '24/7 Availability',
      description: 'Get support whenever you need it, day or night, without any waiting'
    }
  ]

  const testimonials = [
    {
      text: "This AI companion helped me through some really tough nights. It's always there when I need to talk.",
      author: "Sarah M."
    },
    {
      text: "The tone analysis feature is amazing. It really understands how I'm feeling and responds perfectly.",
      author: "James L."
    },
    {
      text: "Much better than I expected. The responses are empathetic and genuinely helpful.",
      author: "Alex K."
    }
  ]

  if (user) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-xl">💖</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Welcome back, <span className="gradient-text">{user.name}</span>!
                    </h1>
                    <p className="text-gray-400 mt-1">How are you feeling today?</p>
                  </div>
                </div>
                <ChatWindow />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Your Journey</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-all duration-300">
                    <div>
                      <p className="text-gray-400 text-sm">Today's Mood</p>
                      <p className="text-white font-semibold">Checking in</p>
                    </div>
                    <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-pink-400">😊</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-all duration-300">
                    <div>
                      <p className="text-gray-400 text-sm">Chat Sessions</p>
                      <p className="text-white font-semibold">Ready to talk</p>
                    </div>
                    <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-pink-400">💬</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Quick Support</h3>
                <div className="space-y-3">
                  <button className="w-full bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-4 rounded-2xl font-semibold transition-all duration-300 hover-lift text-left flex items-center space-x-3">
                    <span className="text-xl">🧘</span>
                    <span>Breathing Exercises</span>
                  </button>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-4 rounded-2xl font-medium transition-all duration-300 text-left flex items-center space-x-3">
                    <span className="text-xl">📝</span>
                    <span>Mood Journal</span>
                  </button>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-4 rounded-2xl font-medium transition-all duration-300 text-left flex items-center space-x-3">
                    <span className="text-xl">🎯</span>
                    <span>Coping Strategies</span>
                  </button>
                </div>
              </div>

              {/* Crisis Resources */}
              <div className="bg-linear-to-br from-red-500/10 to-red-600/5 rounded-3xl p-6 border border-red-500/30 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">🆘 Immediate Help</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-red-500/20 rounded-2xl p-4">
                    <p className="text-red-400 font-semibold">Suicide & Crisis Lifeline</p>
                    <p className="text-red-300 text-2xl font-bold mt-1">988</p>
                  </div>
                  <div className="bg-red-500/20 rounded-2xl p-4">
                    <p className="text-red-400 font-semibold">Crisis Text Line</p>
                    <p className="text-red-300 font-bold mt-1">Text HOME to 741741</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Your AI Mental Health
              <span className="block gradient-text">Companion</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              A safe, supportive space to talk about your feelings, get personalized coping strategies, 
              and receive compassionate AI-powered mental health support anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift hover-glow shadow-2xl"
              >
                Start Your Journey - It's Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift"
              >
                Returning User
              </Link>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-linear-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How MindCare <span className="gradient-text">Supports You</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI companion is designed with empathy and understanding to provide meaningful mental health support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-pink-500/50 transition-all duration-500 hover-lift group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-xl text-gray-400">
              Real people, real support, real results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-pink-500/30 transition-all duration-300 hover-lift"
              >
                <div className="text-4xl text-pink-400 mb-4">❝</div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {testimonial.text}
                </p>
                <p className="text-pink-400 font-semibold">
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-12 border border-gray-700 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Feel <span className="gradient-text">Better</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found comfort and support through our AI mental health companion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift hover-glow"
              >
                Start Free Today
              </Link>
              <Link
                to="/login"
                className="border-2 border-gray-600 text-gray-400 hover:border-pink-500 hover:text-pink-500 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover-lift"
              >
                Existing Account
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              No credit card required • Always free • Privacy first
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home