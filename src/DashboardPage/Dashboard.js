// src/DashboardPage/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';

const apiKey = 'v5zqy2qw283c';
const client = StreamChat.getInstance(apiKey);

function Dashboard() {
    const navigate = useNavigate(); 

    const connectToStreamChat = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const authToken = userData ? userData.token : null;

        try {
            const response = await fetch('http://localhost:5000/auth/verifyToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData.userId,
                    token: authToken, // JWT token from Spring Boot
                }),
            });

            const data = await response.json();

            if (data.streamToken) {
                await client.connectUser({
                    id: data.userId,
                    username: userData.username,
                    fullName: userData.fullName,
                    role: userData.role,
                    //role: 'professional' testing
                }, data.streamToken);

                // Navigate to chat page after successful connection
                navigate('/chat');
            } else {
                // Handle error or invalid token response
                console.error('Failed to get StreamChat token:', data.message);
            }
        } catch (error) {
            console.error('Error fetching StreamChat token:', error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your Dashboard!</p>
            <button onClick={connectToStreamChat}>Go to Chat</button>
        </div>
    );
}

export default Dashboard;
