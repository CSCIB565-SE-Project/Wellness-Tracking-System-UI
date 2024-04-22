import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
// import { useSpring, animated } from 'react-spring';

import logo from '../assests/img/logo.png';

import '../styles/AdminDashboard.css'; // Adjust the path to your CSS file

//A function to connect to the chat
const connectToStreamChat = async (navigate) => {
    const apiKey = 'v5zqy2qw283c';
    const client = StreamChat.getInstance(apiKey);
    const userData = JSON.parse(localStorage.getItem('user'));
    const authToken = userData ? userData.token : null;
  
    try {
        const response = await fetch('https://wtschatservice.azurewebsites.net/auth/verifyToken', {
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

 
  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData;
  }
  


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false); // New state to control animations
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); 
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [contents, setContents] = useState([
      ''
    ]);
    const [UserFullName, setUserFullName] = useState('');

    const handleLogout = () => {
        // Clear local storage or any other clean-ups.
        navigate('/login');
    };

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

    useEffect(() => {
        const userData = getUserData();
        getUserFullName();
        getunapprovedcontent(userData);
        setTimeout(() => setIsLoaded(true), 500); // Simulating a loading delay

      }, []);

      const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const onNavigate = (path) => {
        navigate(path);
    };

    const displayDeleteSuccessMessage = () => {
      alert('Content Approved!');
    };
    
    const approveContent = async(id) => {
        setIsLoading(true);
        setError('');
        const userData = getUserData();
        const jwtToken = userData.token;
        try{
          const response = await fetch(`http://localhost:8080/admin/approve`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ id }),
        });
        if(!response.ok){
          throw new Error("Failed to delete workout plans");
        }
        else{
          displayDeleteSuccessMessage();
          getunapprovedcontent(userData);
        }
      } catch(error) {
        console.error('Fetch error:', error);
        setError('An error occurred while fetching. Contact admin.');
        setIsLoading(false);
      }
    };

    const rejectContent = (id) => {
      setContents(contents.map(content => 
          content.id === id ? { ...content, status: "Rejected" } : content
      ));
  };

 


const getunapprovedcontent= async(userData) => {
    setIsLoading(true);
    setError('');
    const jwtToken = userData.token;
    console.log(jwtToken);
    try{
      const response = await fetch(`http://localhost:8080/admin/getVideos`, { 

      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
    });

    if(!response.ok){
      throw new Error("Failed to fetch VIDEOS");
    }
    console.log(response);
    const data = await response.json();
    console.log(data);
    setContents(data);
    setIsLoading(false);
  } catch(error) {
    console.error('Fetch error:', error);
    setError('An error occurred while fetching. Contact admin.');
    setIsLoading(false);

    
}
}

const getUserFullName = async() => {
  const userData = getUserData();
  var fullName = userData.firstname ;
  setUserFullName(fullName)   ;
};



const [isFlippedContent, setIsFlippedContent] = useState(false);
const [isFlippedMetrics, setIsFlippedMetrics] = useState(false);
const [isFlippedFeedback, setIsFlippedFeedback] = useState(false);

const handleFlipContent = () => {
  setIsFlippedContent(!isFlippedContent);
  setIsFlippedMetrics(false);
  setIsFlippedFeedback(false);
};

const handleFlipMetrics = () => {
  setIsFlippedMetrics(!isFlippedMetrics);
  setIsFlippedContent(false);
  setIsFlippedFeedback(false);
};

const handleFlipFeedback = () => {
  setIsFlippedFeedback(!isFlippedFeedback);
  setIsFlippedContent(false);
  setIsFlippedMetrics(false);
};



return (

<div className={`admin-dashboard ${isLoaded ? 'fade-in' : ''}`}>
      <header className="dashboard-header">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" onClick={() => navigate('/')} />
          <h1>Fit Inc.</h1>a
        </div>

        <nav className="main-nav">
          <button onClick={handleFlipContent}>Contents</button>
          <button onClick={handleFlipMetrics}>Metrics</button>
          <button onClick={handleFlipFeedback}>User Feedback</button>
        </nav>

        <div className="user-section">
          <button onClick={toggleProfileDropdown}>Hello, {UserFullName}</button>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <button onClick={() => navigate('/change-profile')}>Change Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

     
     <div className="welcome">
      <h1> {UserFullName} Dashboard</h1>

      </div>

      <main className="dashboard-content">
        <aside className="sidebar-left">
       
        <div className={`card-container ${isFlippedContent ? 'flipped' : ''}`} onClick={handleFlipContent}>
               <div className="card">
                <div className="card-front">
                    <section className={`content-approval section-card fade-in ${isLoaded ? 'visible' : ''}`}>
                          <h3>Content Approval</h3>
                          {contents.map(content => (
                            <div key={content.id} className="content-item">
                              <div className="video-column">
                                <strong>Video:</strong> {content.title}
                              </div>
                              <div className="status-column">
                                <strong>Status:</strong> {content.status || 'Pending'}
                              </div>
                              <div className="action-buttons">
                                <button onClick={() => approveContent(content.id)}>Approve</button>
                                <button onClick={() => rejectContent(content.id)}>Reject</button>
                              </div>
                            </div>
                          ))}
                    </section>
                  </div> 
                

                <div className="card-back">
                <h4>Contents to be approved</h4>
                  <p>Number of videos pending: 5</p>
                  <p>Most recent submission by: Prinston Rebello</p>
                  <p>Most submissions from: Krina Shah</p>                 
              </div>
            </div>
          </div>
          

            <div className={`card-container ${isFlippedContent ? 'flipped' : ''}`} onClick={handleFlipMetrics}>
              <div className="card">
                <div className="card-front">
                  <section>
                    <h3>Application Metrics</h3>
                     {metrics.map((metric, index) => (
                    <p key={index}>{metric.label}: {metric.value}</p>
                ))}
    </section>
    </div>
    <div className="card-back">
              <h4>Content Insights</h4>
            <ul>
              <li>Views: 1,234</li>
              <li>Likes: 112</li>
              <li>Comments: 35</li>
              <li>Share Rate: 2.5%</li>
            </ul>
          </div>
        </div>
      </div>
  </aside>
  </main>


          
        <aside className="sidebar-right">
        <div className={`card-container ${isFlippedFeedback ? 'flipped' : ''}`}>
        <div className="card">
              <div className="card-front">
                <section className="section-card">
                <h3>User Feedback</h3>
                {userFeedback.map(feedback => (
                    <div key={feedback.id} className="feedback-item">
                        <p><strong>{feedback.user}:</strong> {feedback.feedback}</p>
                    </div>

                ))}
          </section>

          </div>
          <div className="card-back">
                    {/* Feedback analysis or additional details */}

          </div>
        </div>
      </div>


          <section className="section-card">
          <h3>Quick Actions</h3>
                <button>Create Announcement</button>
                <button>View Reports</button>
                <button>Manage Users</button>
          </section>

          <section className="section-card ">
          <h3>Admin Announcements</h3>
                {adminAnnouncements.map(announcement => (
                    <div key={announcement.id} className="announcement-item">
                        <p>{announcement.announcement}</p>
                  </div>
                 ))}
          </section>
        </aside>
   

      <div className="chat-fab-container">
        <button className="chat-fab" onClick={() => connectToStreamChat(navigate)}>💬 Chat</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
