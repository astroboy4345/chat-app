import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './pages/Register'
import SetAvatar from './pages/setAvatar'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Welcome from './Components/Welcome'

const App = () => {
   return <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/setAvatar' element={<SetAvatar/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/welcome' element={<Welcome/>}/>
        <Route path='/' element={<Welcome/>}/>
      </Routes>
   </BrowserRouter>
}

export default App
