import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import NotFound404 from './pages/NotFound404'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import VerifyAccount from "./pages/VerifyAccount"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}


function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<RegisterAndLogout />}></Route>
        <Route path='/logout' element={<Login/>}></Route>
        <Route path='/verify' element={<VerifyAccount/>}></Route>
        <Route path='*' element={<NotFound404/>}></Route>
        
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
