import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import MessageBubble from './MessageBubble'

const ChatWindow = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  
  const { user, token } = useAuth()
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const recognitionRef = useRef(null)

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
  }

  return (
    <div className="flex flex-col h-[600px] bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl">💖</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Mental Health Companion</h3>
              <p className="text-gray-400 text-sm">Here to listen and support you 24/7</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-gray-400 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-2xl transition-all duration-300"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
            <div className="bg-gray-800 rounded-3xl rounded-bl-none px-6 py-4 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-400 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-6 bg-gray-800/30">
        <div className="flex space-x-4 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts and feelings... (Press Enter to send, Shift+Enter for new line)"
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-300"
              rows="1"
              disabled={isLoading}
              style={{ minHeight: '60px', maxHeight: '120px' }}
            />
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`absolute right-3 bottom-3 p-3 rounded-2xl transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gray-700 hover:bg-gray-600 hover-lift'
              }`}
              title="Voice message"
            >
              <span className="text-lg">
                {isRecording ? '🔴' : '🎤'}
              </span>
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover-lift hover-glow flex items-center space-x-2"
          >
            <span>Send</span>
            <span className="text-lg">🚀</span>
          </button>
        </div>
        
        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {["I'm feeling anxious today", "Had a rough day", "Feeling grateful", "Need some encouragement"].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-xl transition-all duration-300 hover-lift"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatWindow