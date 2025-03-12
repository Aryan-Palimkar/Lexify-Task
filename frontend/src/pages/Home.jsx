import { useState, useEffect, useRef } from 'react'
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { jwtDecode } from 'jwt-decode'

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
  const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN));

  const access_token = localStorage.getItem(ACCESS_TOKEN)

  useEffect(() => {
    // API call to get chat list
    const user_id = jwtDecode(access_token)['sub']
    api.get("/", {
      params: {
        user_id: user_id,
      }
    }).then((response) => {
      setChatList(response.data)
      console.log(response.data)
    })
  }, [])

  useEffect(() => {
    // Load chat messages when currentChatId changes
    if (currentChatId) {
      api.get(`/${currentChatId}`).then((response) =>{
        try{
          const formattedData = response.data.map(item => ({
            id: item.id,
            sender: item.sender === "user" ? "user" : "bot",
            content: item.content,
            created_at: item.created_at
          }));
          console.log(formattedData)
          setChatHistory(formattedData);
        }
        catch (e){
          console.log(e)
        }
      })
    }
  }, [currentChatId])

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom()
  }, [chatHistory])

  // Close dropdown when clicking outside
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

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    // Add user message
    const newUserMessage = {
      sender: "user",
      content: message,
      timestamp: new Date().toISOString()
    }

    try{
      api.post("/save", {
        conv_id: currentChatId,
        sender: "user",
        created_at: "2025-03-09T12:42:59+00:00",
        content: message,
      })
    } catch (e){
      console.log(e)
    }
    
    setChatHistory([...chatHistory, newUserMessage])
    setMessage('')
    setIsLoading(true)
    
    // Simulate bot response after delay
    setTimeout(() => {
      const botResponse = {
        id: chatHistory.length + 2,
        sender: "bot",
        content: "Bot response",
        timestamp: new Date().toISOString()
      }
      
      setChatHistory(prev => [...prev, botResponse])
      setIsLoading(false)
    }, 1500)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // TODO
  const startNewChat = () => {

    const newChat = {
      title: "New Conversation",
      createdAt: new Date().toISOString()
    }

    const access_token = localStorage.getItem(ACCESS_TOKEN)
    const user_id = jwtDecode(access_token)['sub']
    const timestamp = new Date().toISOString()

    api.post("/newchat", {
      user_id: user_id,
      created_at: timestamp,
      updated_at: timestamp,
      title: "Test Title"
    }).then((response) => {
      setCurrentChatId(response.data.chat_id)
    })
    setChatList([newChat, ...chatList])
    setChatHistory([])
    setModal(false)
  }

  const selectChat = (chatId) => {
    setCurrentChatId(chatId)
    setModal(false)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.clear();
      console.log("Logged out successfully");
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout error:", e);
    }
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-sky-50">
      <header className="flex items-center justify-between p-3 bg-white shadow-sm">
        <div className='flex flex-row gap-3'>
          <button className="w-9 h-9 rounded-full text-sky-700 hover:bg-sky-100" onClick={() => setModal(true)}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <span className="ml-2 text-2xl font-semibold text-sky-700">Lexify</span>
        </div>
        <div className='mx-2 relative' ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center justify-between gap-2 cursor-pointer font-semibold border-2 border-gray-500 bg-blue-100 p-2 rounded-xl hover:bg-blue-200 transition-colors duration-200">
            <span>Profile</span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden transform origin-top-right transition-all duration-200 ease-out scale-100 opacity-100 z-50">
              <div className="py-1">
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center gap-2">
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Chat History Modal */}
      {modal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm z-50 flex items-start justify-center">
          <div className="bg-white w-full max-w-md mt-16 rounded-lg shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-sky-700">Your Conversations</h2>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-700">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="p-2">
              <button 
                onClick={startNewChat}
                className="w-full mb-3 p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-plus"></i>
                <span>New Conversation</span>
              </button>
              
              <div className="max-h-96 overflow-y-auto">
                {chatList.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => selectChat(chat.id)}
                    className={`p-3 border-b cursor-pointer hover:bg-sky-50 ${currentChatId === chat.id ? 'bg-sky-100' : ''}`}
                  >
                    <h3 className="font-medium text-gray-800">{chat.title}</h3>
                    <p className="text-sm text-gray-500">{formatDate(chat.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 flex flex-col p-4">
        {/* Chat Messages */}
        {currentChatId ? (
          <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto">
            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 mb-4">
              <div className="space-y-4">
                {chatHistory.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 rounded-lg p-3 ${
                        msg.sender === 'user' 
                          ? 'bg-sky-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
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
            </div>
            
            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="bg-sky-600 text-white p-3 rounded-r-lg hover:bg-sky-600 disabled:bg-sky-400"
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
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
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