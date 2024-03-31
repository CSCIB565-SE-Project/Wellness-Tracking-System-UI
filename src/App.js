// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginPage/LoginForm';
import logo from './LoginPage/FitInc.png'; 
import Dashboard from './DashboardPage/Dashboard';
import PasswordResetForm from './LoginPage/PasswordResetForm';
import NewPasswordResetForm from './LoginPage/NewPasswordResetForm';
import SignupForm from './LoginPage/SignupForm';
import ChatPage from './ChatPage/ChatPage';

function App() {
  return (
    //need to add protection from navigating anywhere for deployment
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm logo={logo} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<PasswordResetForm />} />
          <Route path="/reset-password" element={<NewPasswordResetForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;



