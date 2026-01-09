import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import MessageBubble from './MessageBubble'

const ChatWindow = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  
  const { user, token } = useAuth()
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const recognitionRef = useRef(null)
  const chatContainerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize initial AI greeting
    if (messages.length === 0) {
      setMessages([{
        sender: 'ai',
        text: "Hi there! I'm your mental health companion. I'm here to listen and support you through whatever you're experiencing. How are you feeling today?",
        tone: 'calm',
        timestamp: new Date()
      }])
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsRecording(false)
      }

      recognitionRef.current.onerror = () => {
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setShowSuggestions(false)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages
        })
      })

      const data = await response.json()

      if (response.ok) {
        const aiMessage = {
          sender: 'ai',
          text: data.text,
          tone: data.tone,
          tips: data.tips,
          nextSteps: data.next_steps,
          urgency: data.urgency,
          risk: data.risk,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        sender: 'ai',
        text: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        tone: 'neutral',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e) => {
    setInputMessage(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  const clearChat = () => {
    setMessages([{
      sender: 'ai',
      text: "Hi there! I'm your mental health companion. I'm here to listen and support you through whatever you're experiencing. How are you feeling today?",
      tone: 'calm',
      timestamp: new Date()
    }])
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[600px] bg-linear-to-br from-gray-900 to-gray-800 rounded-lg md:rounded-3xl border border-gray-700 shadow-xl md:shadow-2xl overflow-hidden mx-2 md:mx-0">
      {/* Chat Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-white text-lg md:text-xl">💖</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg md:text-xl font-bold text-white truncate">AI Mental Health Companion</h3>
              <p className="text-gray-400 text-xs md:text-sm truncate">Here to listen and support you 24/7</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-gray-400 hover:text-white hover:bg-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-2xl transition-all duration-300 text-sm md:text-base whitespace-nowrap shrink-0"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6"
      >
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            message={message} 
            isUser={message.sender === 'user'}
          />
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-800 rounded-2xl md:rounded-3xl rounded-bl-none px-4 py-3 md:px-6 md:py-4 max-w-xs md:max-w-sm lg:max-w-md">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-400 text-xs md:text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4 md:p-6 bg-gray-800/30">
        <div className="flex space-x-2 md:space-x-4 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts and feelings..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl md:rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-300 text-sm md:text-base"
              rows="1"
              disabled={isLoading}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`absolute right-2 bottom-2 p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Voice message"
            >
              <span className="text-base md:text-lg">
                {isRecording ? '🔴' : '🎤'}
              </span>
            </button>
            <div className="absolute left-3 bottom-3 md:hidden">
              <span className="text-xs text-gray-500">⏎ to send</span>
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-1 md:space-x-2 shrink-0"
          >
            <span className="text-sm md:text-base">Send</span>
            <span className="text-base md:text-lg">🚀</span>
          </button>
        </div>
        
        {/* Quick Suggestions */}
        {showSuggestions && (
          <div className="mt-4">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {["I'm anxious", "Rough day", "Feeling grateful", "Need encouragement"].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 md:px-3 md:py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Helper Text for Desktop */}
        <div className="hidden md:block mt-3">
          <p className="text-gray-500 text-xs text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow