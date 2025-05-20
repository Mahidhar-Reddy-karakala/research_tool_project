import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing'
import Navbar from './components/Navbar';


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
      <Navbar />
        <Routes>
          
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={< Register/>} />
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
