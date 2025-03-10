import React from 'react';
import { useNavigate } from "react-router-dom";

const EmailConfirmationPage = () => {
  const navigate = useNavigate();
  
  const handleBackToLogin = () => {
    navigate("/login");
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
          <div className="bg-gradient-to-r from-sky-100 to-blue-50 rounded-xl shadow-lg overflow-hidden border border-sky-200 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-4">
                <i className="fa-solid fa-envelope text-4xl"></i>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-sky-700 mb-4">Verification Email Sent</h1>
            
            <p className="text-gray-600 mb-6">
              We've sent a verification email to your account. Please check your inbox and follow the instructions to complete your registration.
            </p>
            
            <div className="space-y-4">
              <button  className="w-full flex justify-center py-3 px-4 border border-sky-300 rounded-lg shadow-sm text-sky-700 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transform hover:scale-[1.02] transition-all duration-200" onClick={handleBackToLogin}>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-sky-600">
        Footer
      </footer>
    </div>
  );
};

export default EmailConfirmationPage;