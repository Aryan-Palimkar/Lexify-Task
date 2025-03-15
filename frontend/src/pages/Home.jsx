import { useState, useEffect, useRef } from 'react'
import api from '../api'
import { ACCESS_TOKEN } from '../constants'
import { jwtDecode } from 'jwt-decode'
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [modal, setModal] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [chatList, setChatList] = useState([])
  const [message, setMessage] = useState('')
  const [currentChatId, setCurrentChatId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const dropdownRef = useRef(null)

  const access_token = localStorage.getItem(ACCESS_TOKEN)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const fetchChatList = async () => {
    try {
      const user_id = jwtDecode(access_token)?.sub
      if (!user_id) return
      
      const response = await api.get("/", {
        params: { user_id }
      })
      setChatList(response.data)
    } catch (error) {
      console.error("Failed to fetch chat list:", error)
    }
  }

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await api.get(`/${chatId}`)
      const formattedData = response.data.map(item => ({
        id: item.id,
        sender: item.sender === "user" ? "user" : "bot",
        content: item.content,
        created_at: item.created_at
      }))
      setChatHistory(formattedData)
    } catch (error) {
      console.error("Failed to fetch chat messages:", error)
    }
  }

  // Fetch chat list when the component loads
  useEffect(() => {
    fetchChatList()
  }, [])

  
  useEffect(() => {
    if (currentChatId) {
      fetchChatMessages(currentChatId)
    }
  }, [currentChatId])

  // Auto-scroll to bottom when loading new chat
  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !currentChatId) return
    
    const newUserMessage = {
      id: `temp-${Date.now()}`,
      sender: "user",
      content: message,
      created_at: new Date().toISOString()
    }
    
    const currentMessage = message
    setChatHistory(prev => [...prev, newUserMessage])
    setMessage('')
    setIsLoading(true)
    
    try {
      const response = await api.post(`/${currentChatId}/ask`, {
        conv_id: currentChatId,
        query_text: currentMessage,
      })

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: response.data,
        created_at: new Date().toISOString(),
      }

      setChatHistory(prev => [...prev, botMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
      alert(error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return dateString
    }
  }

  const startNewChat = async () => {
    try {
      setIsLoading(true)
      const user_id = jwtDecode(access_token)?.sub
      if (!user_id) return
      
      const timestamp = new Date().toISOString()
      const response = await api.post("/newchat", {
        user_id,
        created_at: timestamp,
        updated_at: timestamp,
        title: "New Conversation"
      })
      
      const newChatId = response.data.chat_id
      setCurrentChatId(newChatId)
      
      // Refresh chat list after creating new chat
      fetchChatList()
      setChatHistory([])
      setModal(false)
    } catch (error) {
      console.error("Failed to create new chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectChat = (chatId) => {
    if (chatId === currentChatId) {
      setModal(false)
      return
    }
    setCurrentChatId(chatId)
    setModal(false)
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout")
      localStorage.clear()
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
    setDropdownOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-sky-50">
      <header className="flex items-center justify-between p-3 bg-white shadow-sm">
        <div className='flex flex-row gap-3 items-center'>
          <button 
            className="w-9 h-9 rounded-full text-sky-700 hover:bg-sky-100 flex items-center justify-center" 
            onClick={() => setModal(true)}
            aria-label="Open chat list"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <span className="text-2xl font-semibold text-sky-700">Lexify</span>
        </div>
        <div className='mx-2 relative' ref={dropdownRef}>
          <button 
            onClick={toggleDropdown} 
            className="flex items-center justify-between gap-2 cursor-pointer font-semibold border-2 border-gray-500 bg-blue-100 p-2 rounded-xl hover:bg-blue-200 transition-colors duration-200"
            aria-expanded={dropdownOpen}
            aria-label="Profile menu"
          >
            <span>Profile</span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
              <div className="py-1">
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="fa-solid fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Chat History Modal */}
      {modal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm z-50 flex items-start justify-center" onClick={(e) => {
          if (e.target === e.currentTarget) setModal(false)
        }}>
          <div className="bg-white w-full max-w-md mt-16 rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-sky-700">Your Conversations</h2>
              <button 
                onClick={() => setModal(false)} 
                className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="p-2">
              <button 
                onClick={startNewChat}
                disabled={isLoading}
                className="w-full mb-3 p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2 disabled:bg-sky-400"
              >
                <i className="fa-solid fa-plus"></i>
                <span>New Conversation</span>
              </button>
              
              <div className="max-h-96 overflow-y-auto">
                {chatList.length > 0 ? (
                  chatList.map(chat => (
                    <div 
                      key={chat.id}
                      onClick={() => selectChat(chat.id)}
                      className={`p-3 border-b cursor-pointer hover:bg-sky-50 ${currentChatId === chat.id ? 'bg-sky-100' : ''}`}
                    >
                      <h3 className="font-medium text-gray-800">{chat.title || "Untitled Conversation"}</h3>
                      <p className="text-sm text-gray-500">{formatDate(chat.createdAt || chat.created_at)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">No conversations yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 flex flex-col p-4">
        {/* Chat Messages */}
        {currentChatId ? (
          <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto">
            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 mb-4 min-h-[70vh]">
              {chatHistory.length > 0 ? (
                <div className="space-y-4">
                  {chatHistory.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xl rounded-lg p-3 ${
                          msg.sender === 'user' 
                            ? 'bg-sky-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        <p className="whitespace-pre-line break-words"><ReactMarkdown>{msg.content}</ReactMarkdown></p>
                        <div className="text-xs mt-1 text-right opacity-70">
                          {formatDate(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Start your conversation with Lexify</p>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here... (Press Enter to send)"
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[50px] max-h-[150px] resize-y"
                rows={1}
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="bg-sky-600 text-white p-3 rounded-r-lg hover:bg-sky-700 disabled:bg-sky-400 flex items-center justify-center min-w-[50px]"
                aria-label="Send message"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-sky-700 mb-2">Welcome to Lexify</h1>
              <p className="text-xl text-sky-600">Your AI Legal Assistant</p>
            </div>
            <button 
              onClick={startNewChat}
              disabled={isLoading}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2 disabled:bg-sky-400"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Start a New Conversation</span>
            </button>
          </div>
        )}
      </main>
      
      <footer className="p-4 text-center text-sm text-sky-600 bg-white shadow-sm">
        © 2025 Lexify - AI-Powered Legal Assistant
      </footer>
    </div>
  )
}