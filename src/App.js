import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './LandingPage/Header';
import Hero from './LandingPage/Hero';
import Exercises from './LandingPage/Exercises';
import Pricing from './LandingPage/Pricing';
import Start from './LandingPage/Start';
import Testimonial from './LandingPage/Testimonial';
import LoginPage from './LoginPage/LoginForm.js';
import SignUpPage from './LoginPage/SignupForm.js' ;
import logo from './LoginPage/FitInc.png';
import UserDashboard from './DashboardPage/UserDashboard.jsx';
import ProfessionalDashboard from './DashboardPage/ProfessionalDashboard.jsx';
import AdminDashboard from './DashboardPage/AdminDashboard.jsx';
import ChatPage from './ChatPage/ChatPage.js';
import WorkoutPlanPage from './WorkoutPlanPage/WorkoutPlanPage.jsx'



const LandingPage = () => (
  <>
    <Header />
    <Hero />
    <Exercises />
    <Pricing />
    <Start />
    <Testimonial />
  </>
);


function App() {
  return (
    <Router>

      <Routes>
       
         <Route path="/" element={<LandingPage />} />
         <Route path="/login" element={<LoginPage logo={logo} />} />
         <Route path="/signup" element={<SignUpPage/>} />
         <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/professionaldashboard" element={<ProfessionalDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/chat" element={<ChatPage />} /> 
        <Route path="/chat" element={<ChatPage />} /> 
        <Route path="/workout-plan/:planId" element={<WorkoutPlanPage />} />

      </Routes>
    </Router>
  
  );
  }

  export default App;