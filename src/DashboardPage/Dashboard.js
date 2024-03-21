// src/DashboardPage/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate(); 

  const handleChatButtonClick = () => {
    navigate('/chat'); 
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your Dashboard!</p>
      <button onClick={handleChatButtonClick}>Go to Chat</button>
    </div>
  );
}

export default Dashboard;
