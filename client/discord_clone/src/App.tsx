import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from './pages/SocketContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Server from './pages/Server';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<Home />} />
          <Route path='/server/:id' element={<Server />} />
          <Route path='/channel/:id' element={<ChatRoom />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
    
  )
}

export default App
