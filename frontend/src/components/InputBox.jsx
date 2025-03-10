import { useState } from "react";

export default function InputBox(){
    const [inputValue, setInputValue] = useState('');

    return(
        <div className="bg-gradient-to-r from-sky-100 to-blue-50 w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative flex flex-col">
            <textarea 
              className="w-full p-4 pr-16 min-h-21 text-gray-800 border-0 focus:ring-0 focus:outline-none resize-none"
              placeholder="What do you want to know?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />  
            
            <div className="absolute bottom-1 right-0 p-4 flex items-center">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-200">
                <i className="fa-solid fa-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
    );
}