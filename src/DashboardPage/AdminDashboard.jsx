import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';


import '../styles/AdminDashboard.css'; // Adjust the path to your CSS file

//A function to connect to the chat
const connectToStreamChat = async (navigate) => {
    const apiKey = 'v5zqy2qw283c';
    const client = StreamChat.getInstance(apiKey);
    const userData = JSON.parse(localStorage.getItem('user'));
    const authToken = userData ? userData.token : null;
  
    try {
        const response = await fetch('http://localhost:5000/auth/verifyToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authToken, // JWT token from Spring Boot
            }),
        });
  
        const data = await response.json();
  
        if (data.streamToken) {
            await client.connectUser({
                id: data.id,
                username: userData.username,
                fullName: userData.fullName,
                role: userData.role,
                //role: 'professional' testing
            }, data.streamToken);
  
            // Navigate to chat page after successful connection
            navigate('/chat');
        } else {
            // Handle error or invalid token response
            console.error('Failed to get StreamChat token JWT may have expired:', data.message);
        }
    } catch (error) {
        console.error('Error fetching StreamChat token:', error);
    }
  };

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    const [contents, setContents] = useState([
        { id: 1, title: "30-Minute Cardio Session", status: "Pending" },
        { id: 2, title: "Yoga for Flexibility", status: "Pending" },
        // More contents
    ]);


    const [metrics, setMetrics] = useState ([
        { label: "User Count", value: 150 },
        { label: "App Usage", value: "75%" },
        // Other metrics
    ]);

    const [userFeedback, setUserFeedback] = useState([
        { id: 1, user: "John Doe", feedback: "Great session on cardio!" },
        { id: 2, user: "Jane Smith", feedback: "Loved the yoga flexibility video." },
        // More feedback items...
    ]);

    const [adminAnnouncements, setAdminAnnouncements] = useState([
        { id: 1, announcement: "New content update coming next week!" },
        { id: 2, announcement: "Maintenance scheduled for the upcoming weekend." },
        // More announcements...
    ]);

    const approveContent = (id) => {
        setContents(contents.map(content => 
            content.id === id ? { ...content, status: "Approved" } : content
        ));
    };

    return (
        <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
         {/* Content Approval Section */}
         <div className="content-approval">
                <h3>Content Approval</h3>
                {contents.map(content => (
                    <div key={content.id} className="content-item">
                        <h4>{content.title}</h4>
                        <p>Status: {content.status}</p>
                        {content.status === "Pending" && (
                            <button onClick={() => approveContent(content.id)}>Approve</button>
                        )}
                    </div>
                ))}
            </div>

     <div className="metrics">
                <h3>Application Metrics</h3>
                {metrics.map((metric, index) => (
                    <p key={index}>{metric.label}: {metric.value}</p>
                ))}
            </div>

       {/* User Feedback Section */}
       <div className="user-feedback">
                <h3>User Feedback</h3>
                {userFeedback.map(feedback => (
                    <div key={feedback.id} className="feedback-item">
                        <p><strong>{feedback.user}:</strong> {feedback.feedback}</p>
                    </div>
                ))}
            </div>

            {/* Admin Announcements Section */}
            <div className="admin-announcements">
                <h3>Admin Announcements</h3>
                {adminAnnouncements.map(announcement => (
                    <div key={announcement.id} className="announcement-item">
                        <p>{announcement.announcement}</p>
                    </div>
                ))}
            </div>
        

            {/* Quick Actions Panel */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <button>Create Announcement</button>
                <button>View Reports</button>
                <button>Manage Users</button>
                {/* Add more actions as needed */}
            </div>


            <div className="chat-fab-container">
  <button className="chat-fab" onClick={() => connectToStreamChat(navigate)}>
    💬 Chat
  </button>
</div>
        </div>
    );
};

export default AdminDashboard;
