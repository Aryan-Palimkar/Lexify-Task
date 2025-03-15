import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post("/register", {
        email: email,
        newPassword: password,
        confirmPassword: confirmPassword,
        phoneNo: phone,
        name: username
      });
      localStorage.setItem(ACCESS_TOKEN, res.data.access_token);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh_token);
      navigate("/verify");
    } catch (error) {
      console.log(error);
      alert(error)
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-sky-50">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <span className="ml-2 text-xl font-semibold text-sky-700">Lexify</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-r from-sky-100 to-blue-50 rounded-xl shadow-lg overflow-hidden border border-sky-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-sky-700 mb-2">Create Account</h1>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input 
                    type="text" 
                    required 
                    className="block w-full pl-10 pr-3 py-3 border-0 text-gray-700 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                    placeholder="johndoe" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input 
                    type="email" 
                    required 
                    className="block w-full pl-10 pr-3 py-3 border-0 text-gray-700 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                    placeholder="your@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input 
                    type="tel" 
                    required 
                    className="block w-full pl-10 pr-3 py-3 border-0 text-gray-700 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                    placeholder="+1 (555) 123-4567" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input 
                    type="password" 
                    required 
                    className="block w-full pl-10 pr-3 py-3 border-0 text-gray-700 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input 
                    type="password" 
                    required 
                    className="block w-full pl-10 pr-3 py-3 border-0 text-gray-700 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transform hover:scale-[1.02] transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-sky-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-sky-600 hover:text-sky-500">Login</a>
            </p>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-sky-600">
        Footer
      </footer>
    </div>
  );
};

export default Register;