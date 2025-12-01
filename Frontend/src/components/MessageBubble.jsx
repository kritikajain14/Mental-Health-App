import React from 'react'

const MessageBubble = ({ message, isUser }) => {
  const getToneColor = (tone) => {
    const colors = {
      calm: 'from-blue-500 to-blue-600',
      sad: 'from-purple-500 to-purple-600',
      anxious: 'from-yellow-500 to-yellow-600',
      angry: 'from-red-500 to-red-600',
      neutral: 'from-gray-500 to-gray-600',
      overwhelmed: 'from-orange-500 to-orange-600',
      hopeless: 'from-red-600 to-red-700',
      happy: 'from-green-500 to-green-600',
      tired: 'from-indigo-500 to-indigo-600'
    }
    return colors[tone] || 'from-gray-500 to-gray-600'
  }

  const getToneEmoji = (tone) => {
    const emojis = {
      calm: '😌',
      sad: '😔',
      anxious: '😰',
      angry: '😠',
      neutral: '😐',
      overwhelmed: '😥',
      hopeless: '😞',
      happy: '😊',
      tired: '😴'
    }
    return emojis[tone] || '💭'
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-xs lg:max-w-md rounded-3xl p-6 transition-all duration-300 hover-lift ${
        isUser 
          ? 'bg-linear-to-r from-pink-500 to-pink-600 rounded-br-none shadow-lg' 
          : 'bg-gray-800 rounded-bl-none border border-gray-700 shadow-lg'
      }`}>
        
        {/* Message Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
              isUser ? 'bg-pink-400' : 'bg-gray-600'
            }`}>
              {isUser ? '👤' : '🤖'}
            </div>
            <span className={`text-sm font-medium ${
              isUser ? 'text-white' : 'text-gray-300'
            }`}>
              {isUser ? 'You' : 'MindCare AI'}
            </span>
          </div>
          <span className={`text-xs ${
            isUser ? 'text-pink-100' : 'text-gray-400'
          }`}>
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Message Text */}
        <p className={`text-lg leading-relaxed ${
          isUser ? 'text-white' : 'text-gray-100'
        }`}>
          {message.text}
        </p>
        
        {/* Tone Indicator for AI messages */}
        {!isUser && message.tone && (
          <div className="flex items-center mt-4 space-x-3 p-3 bg-black/20 rounded-2xl">
            <div className={`w-8 h-8 bg-linear-to-r ${getToneColor(message.tone)} rounded-full flex items-center justify-center`}>
              <span className="text-white text-sm">{getToneEmoji(message.tone)}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Detected Mood</p>
              <p className="text-white font-medium capitalize">{message.tone}</p>
            </div>
          </div>
        )}
        
        {/* Tips Section */}
        {!isUser && message.tips && message.tips.length > 0 && (
          <div className="mt-4 p-4 bg-linear-to-r from-pink-500/10 to-pink-600/5 rounded-2xl border border-pink-500/20">
            <p className="text-pink-400 font-semibold text-sm mb-3 flex items-center space-x-2">
              <span>💡</span>
              <span>Quick Tips for You</span>
            </p>
            <ul className="space-y-2">
              {message.tips.map((tip, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Next Steps */}
        {!isUser && message.nextSteps && message.nextSteps.length > 0 && (
          <div className="mt-3 p-4 bg-linear-to-r from-blue-500/10 to-blue-600/5 rounded-2xl border border-blue-500/20">
            <p className="text-blue-400 font-semibold text-sm mb-3 flex items-center space-x-2">
              <span>🎯</span>
              <span>Recommended Next Steps</span>
            </p>
            <ul className="space-y-2">
              {message.nextSteps.map((step, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Crisis Alert */}
        {!isUser && message.risk && message.risk !== 'none' && (
          <div className="mt-4 p-4 bg-linear-to-r from-red-500/20 to-red-600/10 rounded-2xl border border-red-500/30">
            <p className="text-red-400 font-semibold text-sm mb-2 flex items-center space-x-2">
              <span>🚨</span>
              <span>Important Safety Notice</span>
            </p>
            <p className="text-red-300 text-sm">
              If you're in immediate danger or having thoughts of harming yourself, 
              please call your local emergency number or the Suicide & Crisis Lifeline at <strong>988</strong> immediately.
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center space-x-2 text-red-300 text-sm">
                <span>📞</span>
                <span>Suicide & Crisis Lifeline: <strong>988</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-red-300 text-sm">
                <span>💬</span>
                <span>Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Urgency Level */}
        {!isUser && message.urgency && message.urgency !== 'low' && (
          <div className="mt-3 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              message.urgency === 'high' ? 'bg-red-500 animate-pulse' :
              message.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            <span className="text-xs text-gray-400 capitalize">
              {message.urgency} priority
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble