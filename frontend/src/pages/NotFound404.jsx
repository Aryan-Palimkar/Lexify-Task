import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-sky-50">
      <header className="flex items-center justify-between p-3 bg-white shadow-sm">
        <div className='flex flex-row gap-3 items-center'>
          <span className="text-2xl font-semibold text-sky-700">Lexify</span>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-sky-700 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-sky-600 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <i className="fa-solid fa-home"></i>
            <span>Return to Home</span>
          </button>
        </div>
      </main>
      
      <footer className="p-4 text-center text-sm text-sky-600 bg-white shadow-sm">
        © 2025 Lexify - AI-Powered Legal Assistant
      </footer>
    </div>
  )
}