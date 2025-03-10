import InputBox from '../components/Inputbox'
import ChatHistoryModal from '../components/ChatHistoryModal'
import { useState, useEffect } from 'react'
import api from '../api'

export default function Home(){

    const [modal, setModal] = useState(false)

    const [history, setHistory] = useState(null)

    useEffect(() => {
      api.get("http://127.0.0.1:8000/")
      .then((response) => {
      console.log(response.data);
      setHistory(response.data)
      })
    .catch((error) => {
      console.error(error);
      });
    }, [])

    return(
        <div className="flex flex-col min-h-screen bg-sky-50">
            <header className="flex items-center justify-between p-3 bg-white shadow-sm">
              <div className='flex flex-row gap-3'>
                <button className="w-9 h-9 rounded-full text-sky-700 hover:bg-sky-100" onClick={(e) => {setModal(true)}}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <span className="ml-2 text-2xl font-semibold text-sky-700">Lexify</span>
              </div>
              <div className='mx-2'>
                <a href='/profile' className='cursor-pointer text-semibold border-2 border-gray-500 bg-blue-100 p-[6px] rounded-xl'>Profile</a>
              </div>
            </header>
            { modal && <ChatHistoryModal content={history} onClose={(e) => {setModal(false)}}/> }
            <main className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="text-center mb-16">
                <h1 className="text-3xl font-bold text-sky-700 mb-2">Welcome to Lexify.</h1>
                <p className="text-xl text-sky-600">Bottom Text</p>
              </div>
              <InputBox/>
            </main>
            <footer className="p-4 text-center text-sm text-sky-600">
              Footer
            </footer>
        </div>
    )
}