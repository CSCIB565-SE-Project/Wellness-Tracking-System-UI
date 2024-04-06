import React, { useState } from 'react';


import '../../styles/AdminDashboard.css'; // Adjust the path to your CSS file

const AdminDashboard = () => {
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
  <button className="chat-fab" onClick={() => {/* Open chat */}}>
    💬 Chat
  </button>
</div>
        </div>
    );
};

export default AdminDashboard;
