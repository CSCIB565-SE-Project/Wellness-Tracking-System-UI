// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginPage/LoginForm';
import logo from './LoginPage/FitInc.png'; 
import Dashboard from './DashboardPage/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm logo={logo} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;



