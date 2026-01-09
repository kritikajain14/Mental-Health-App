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
      minute: '2-digit',
      hour12: true 
    })
  }

  // Determine bubble width based on content and screen size
  const getBubbleWidth = () => {
    if (isUser) return 'max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[70%]'
    return 'max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%]'
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in px-1`}>
      <div className={`${getBubbleWidth()} rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300 ${
        isUser 
          ? 'bg-linear-to-r from-pink-500 to-pink-600 rounded-br-none md:rounded-br-none shadow-md' 
          : 'bg-gray-800 rounded-bl-none md:rounded-bl-none border border-gray-700 shadow-md'
      }`}>
        
        {/* Message Header */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
              isUser ? 'bg-pink-400' : 'bg-gray-600'
            }`}>
              <span className="text-xs md:text-base">
                {isUser ? '👤' : '🤖'}
              </span>
            </div>
            <span className={`text-xs md:text-sm font-medium truncate ${
              isUser ? 'text-white' : 'text-gray-300'
            }`}>
              {isUser ? 'You' : 'MindCare AI'}
            </span>
          </div>
          <span className={`text-xs shrink-0 ml-2 ${
            isUser ? 'text-pink-100' : 'text-gray-400'
          }`}>
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Message Text */}
        <p className={`text-sm md:text-lg leading-relaxed wrap-break-word ${
          isUser ? 'text-white' : 'text-gray-100'
        }`}>
          {message.text}
        </p>
        
        {/* Tone Indicator for AI messages */}
        {!isUser && message.tone && (
          <div className="flex items-center mt-3 md:mt-4 space-x-2 md:space-x-3 p-2 md:p-3 bg-black/20 rounded-xl md:rounded-2xl">
            <div className={`w-6 h-6 md:w-8 md:h-8 bg-linear-to-r ${getToneColor(message.tone)} rounded-full flex items-center justify-center shrink-0`}>
              <span className="text-white text-xs md:text-sm">{getToneEmoji(message.tone)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 truncate">Detected Mood</p>
              <p className="text-white font-medium capitalize truncate text-sm md:text-base">{message.tone}</p>
            </div>
          </div>
        )}
        
        {/* Tips Section */}
        {!isUser && message.tips && message.tips.length > 0 && (
          <div className="mt-3 md:mt-4 p-3 md:p-4 bg-linear-to-r from-pink-500/10 to-pink-600/5 rounded-xl md:rounded-2xl border border-pink-500/20">
            <p className="text-pink-400 font-semibold text-xs md:text-sm mb-2 md:mb-3 flex items-center space-x-1 md:space-x-2">
              <span className="text-sm md:text-base">💡</span>
              <span>Quick Tips</span>
            </p>
            <ul className="space-y-1 md:space-y-2">
              {message.tips.slice(0, 3).map((tip, index) => ( // Limit tips on mobile
                <li key={index} className="text-gray-300 text-xs md:text-sm flex items-start space-x-2">
                  <span className="text-pink-400 mt-0.5 md:mt-1 shrink-0">•</span>
                  <span className="wrap-break-word">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Next Steps */}
        {!isUser && message.nextSteps && message.nextSteps.length > 0 && (
          <div className="mt-2 md:mt-3 p-3 md:p-4 bg-linear-to-r from-blue-500/10 to-blue-600/5 rounded-xl md:rounded-2xl border border-blue-500/20">
            <p className="text-blue-400 font-semibold text-xs md:text-sm mb-2 md:mb-3 flex items-center space-x-1 md:space-x-2">
              <span className="text-sm md:text-base">🎯</span>
              <span>Next Steps</span>
            </p>
            <ul className="space-y-1 md:space-y-2">
              {message.nextSteps.slice(0, 2).map((step, index) => ( // Limit steps on mobile
                <li key={index} className="text-gray-300 text-xs md:text-sm flex items-start space-x-2">
                  <span className="text-blue-400 mt-0.5 md:mt-1 shrink-0">•</span>
                  <span className="wrap-break-word">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Crisis Alert */}
        {!isUser && message.risk && message.risk !== 'none' && (
          <div className="mt-3 md:mt-4 p-3 md:p-4 bg-linear-to-r from-red-500/20 to-red-600/10 rounded-xl md:rounded-2xl border border-red-500/30">
            <p className="text-red-400 font-semibold text-xs md:text-sm mb-1 md:mb-2 flex items-center space-x-1 md:space-x-2">
              <span className="text-sm md:text-base">🚨</span>
              <span>Important Safety Notice</span>
            </p>
            <p className="text-red-300 text-xs md:text-sm mb-2 md:mb-3 wrap-break-word">
              If you're in immediate danger or having thoughts of harming yourself, 
              please call <strong>911</strong> or the Suicide & Crisis Lifeline at <strong>988</strong> immediately.
            </p>
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center space-x-1 md:space-x-2 text-red-300 text-xs md:text-sm">
                <span className="text-sm md:text-base">📞</span>
                <span className="wrap-break-word"><strong>988</strong> Suicide & Crisis Lifeline</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2 text-red-300 text-xs md:text-sm">
                <span className="text-sm md:text-base">💬</span>
                <span className="wrap-break-word">Text <strong>HOME</strong> to <strong>741741</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Urgency Level */}
        {!isUser && message.urgency && message.urgency !== 'low' && (
          <div className="mt-2 md:mt-3 flex items-center space-x-2">
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
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