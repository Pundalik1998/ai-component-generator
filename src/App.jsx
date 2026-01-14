import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home'
import NoPage from './pages/NoPage'

const App = () => {
  return (
    <>
      <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
