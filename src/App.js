// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginPage/LoginForm';
import logo from './LoginPage/FitInc.png'; 
import Dashboard from './DashboardPage/Dashboard';
import PasswordResetForm from './LoginPage/PasswordResetForm';
import NewPasswordResetForm from './LoginPage/NewPasswordResetForm';
import SignupForm from './LoginPage/SignupForm';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm logo={logo} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<PasswordResetForm />} />
          <Route path="/reset-password" element={<NewPasswordResetForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;



