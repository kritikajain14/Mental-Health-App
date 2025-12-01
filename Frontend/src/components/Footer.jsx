import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 mt-20 glass">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-linear-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">💖</span>
              </div>
              <span className=" font-bold text-xl bg-linear-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                MindCare
              </span>
            </div>
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              Your compassionate AI mental health companion, here to support you 24/7 with empathy and understanding.
            </p>
            <div className="flex space-x-4">
              <div className="bg-linear-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                🆘 Crisis Help: 988
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/home" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                  Chat with AI
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                  Your Profile
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                  Daily Tasks 
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                  Crisis Hotlines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                  Breathing Exercises
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                  Mental Health Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                  Emergency Contacts
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
            © 2025 MindCare AI. This is not a replacement for professional medical help.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-pink-400 transition-colors duration-200 text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-pink-400 transition-colors duration-200 text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-pink-400 transition-colors duration-200 text-sm">
              Contact
            </a>
          </div>
        </div>

        {/* Crisis notice */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <p className="text-red-400 text-sm">
            🚨 If you're in immediate danger, please call your local emergency number or 988 (Suicide & Crisis Lifeline)
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer