import React, { useState, useEffect, useRef } from 'react';
import '../styles/ProfessionalDashboard.css';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addHours from 'date-fns/addHours';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';
import { useNavigate } from 'react-router-dom';
import VideoUpload from './VideoUpload.jsx';
import { StreamChat } from 'stream-chat';

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

const locales = {
  'en-US': enUS,
};


const localizer = dateFnsLocalizer({
    format,
    parse: parseISO,
    startOfWeek,
    getDay,
    locales,
  });

const getUserData = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  return userData;
}


const ProfessionalDashboard = () => {

 
    const headerRef = useRef(null);
  
    const navigate = useNavigate();
    // States for video uploads
    const [workoutPlanTitle, setworkoutPlanTitle] = useState('');
    const [planDescription, setplanDescription] = useState('');
    const [planType, setplanType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [workOutPlans, setWorkOutPlans] = useState([]);
    const [articles, setArticles] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [progressUpdates, setProgressUpdates] = useState([]);
    const [supplements, setSupplements] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    const [subscribedClients, setSubscribedClients] = useState([]);
    const [subscribedClientsCount, setSubscribedClientsCount] = useState([]);
    const [unapprovedVideos, setUnapprovedVideos] = useState([]);
    const [error, setError] = useState(''); 
    const [UserFullName, setUserFullName] = useState('');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);


 
  const nav__links=[
    {
        path:'/workout-plans',
        display: 'Workout Plans'
    },
    {
        path:'/appointments',
        display: 'Appointments'
    },
    {
        path:'/client-metrics',
        display: 'Client-Metrics'
    },
    {
        path:'/clients',
        display: 'Clients'
    }]
   
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUserData(userData);  
    }
    getUserFullName();
    fetchWorkoutPlans(userData);
    fetchSubscribedClients(userData);
    fetchSubscribedCount(userData);
    fetchUnapprovedVideos(userData);

    const mockArticles = [
      { id: 1, title: "Benefits of Yoga", content: "Yoga improves flexibility, strength, and mental well-being." },
      { id: 2, title: "Why Cardio is Vital", content: "Cardiovascular exercise increases heart health and stamina." },
    ];

    setArticles(mockArticles);

    const mockAppointments = [
        { id: 1, date: "2023-10-01", time: "10:00", client: "John Doe", sessionType: "Personal Training" },
        { id: 2, date: "2023-10-03", time: "12:00", client: "Jane Smith", sessionType: "Yoga" },
      ];
    
      const convertedAppointments = mockAppointments.map(appointment => {
        const startTime = parseISO(`${appointment.date}T${appointment.time}`);
        const endTime = addHours(startTime, 1); 
        return { ...appointment, start: startTime, end: endTime };
      });
    
      setAppointments(convertedAppointments);
   
    //Professionals are the ones that are streaming
    //A way to plan live sessions for the future: Name of session, and date + time, then generate a key 
    // Then a way to join that session through OBS when time comes, GetKey???
    // Add the key and the ingress to the live session 
    const mockLiveSessions = [{ id: 1, title: "Live Yoga Session", date: new Date() }];
    
    setLiveSessions(mockLiveSessions);


    const mockProgressReports = [
      { id: 1, client: "John Doe", progress: "Improved 5k run time by 2 minutes." },
      { id: 2, client: "Jane Smith", progress: "Increased flexibility in yoga poses." },
    ];

    setProgressUpdates(mockProgressReports);


    const mockSupplementRecommendations = [
      { id: 1, name: "Whey Protein", benefits: "Helps muscle recovery and growth." },
      { id: 2, name: "Vitamin D", benefits: "Supports bone health and immune function." },
    ];


    setSupplements(mockSupplementRecommendations);


  }, []);

  const fetchUnapprovedVideos = async (userData) => {
      setIsLoading(true);
      setError('');
      const jwtToken = userData.token;
      const trainerId = userData.userId;
      try{
        const response = await fetch(`https://cdnservice.azurewebsites.net/api/videos/unapproved/${trainerId}`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
      });
      if(!response.ok){
        throw new Error("Failed to fetch subscribers");
      }
      else{
        const data = await response.json();
        if(data.length > 0){
          setUnapprovedVideos(data);
        }
        else{
          setUnapprovedVideos([]);
        }
        setIsLoading(false);
      }
    } catch(error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching. Contact admin.');
      setIsLoading(false);
    }
  };

  const openVideo = async(videoId) => {
    navigate(`/videos/${videoId}`);
  }

  const handleSubmit = async(event) => {
      event.preventDefault();
      setIsLoading(true);
      setError('');
      const userData = getUserData();
      const trainerId = userData.userId;
      const jwtToken = userData.token;
      const title = workoutPlanTitle;
      const description = planDescription;
      const typeOfWorkout = planType;

      try{
        const response = await fetch('https://cdnservice.azurewebsites.net/api/workoutplan/add', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ trainerId, title, description, typeOfWorkout }),
          });
          const data = await response.json();
          if (data) {
            console.log('Workout Plan Created Successfully!', data);
            setworkoutPlanTitle('');
            setplanDescription('');
            setplanType('');
            setIsLoading(false);
            setError('');
            displaySuccessMessage();
            fetchWorkoutPlans(userData);
          } 
      } catch {
        console.error('Create error:', error);
        setError('An error occurred. Please try again later.');
      }   
  };

  const getUserFullName = async() => {
    const userData = getUserData();
    var fullName = userData.firstname ;
    setUserFullName(fullName)   ;
  };




  const deleteWorkoutPlan = async(planId) => {
      setIsLoading(true);
      setError('');
      const userData = getUserData();
      console.log(planId);
      const jwtToken = userData.token;
      const userId = userData.userId;
      try{
        const response = await fetch(`https://cdnservice.azurewebsites.net/api/workoutplan/delete/${planId}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ userId }),
      });
      if(!response.ok){
        throw new Error("Failed to delete workout plans");
      }
      else{
        displayDeleteSuccessMessage();
        fetchWorkoutPlans(userData);
      }
    } catch(error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching. Contact admin.');
      setIsLoading(false);
    }
  };

  const fetchSubscribedCount = async(userData) => {
    setIsLoading(true);
    setError('');
    const jwtToken = userData.token;
    const trainerId = userData.userId;
    try{
      const response = await fetch(`https://cdnservice.azurewebsites.net/api/trainers/subc/${trainerId}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
    });
    if(!response.ok){
      throw new Error("Failed to fecth subscribers");
    }
    else{
      const data = await response.json();
      setSubscribedClientsCount(data);
      setIsLoading(false);
    }
  } catch(error) {
    console.error('Fetch error:', error);
    setError('An error occurred while fetching. Contact admin.');
    setIsLoading(false);
  }
};

  const getUserInfo = async(userid) => {
    const response = await fetch(`https://cdnservice.azurewebsites.net/api/users/find/${userid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = response.json();
    return data;
  };

  const getSubscribersList = async(subIds, userData) => {
      setIsLoading(true);
      setError('');
      const clientList = [];
      const userId = userData.id;
      const jwtToken = userData.token;
      for(var subId of subIds){
          try{
              const response = await fetch(`http://localhost:8000/api/users/find/${subId}`, { 
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
              },
            });
            if(!response.ok){
              throw new Error("Failed to fecth subscribers");
            }
            else{
              const data = await response.json();
              clientList.push(data);
            } 
          }catch (error) {
            console.error("Error fetching user info for user ID:", userId, error); // Log any errors from getUserInfo
            // Handle the error as needed, e.g., continue processing other user IDs
          }
        }
        setIsLoading(false);
        return clientList;
      };

  const fetchSubscribedClients = async(userData) => {
      setIsLoading(true);
      setError('');
      const jwtToken = userData.token;
      const trainerId = userData.userId;
      try{
        const response = await fetch(`http://localhost:8000/api/trainers/sub/${trainerId}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
      });
      if(!response.ok){
        throw new Error("Failed to fecth subscribers");
      }
      else{
        const data = await response.json();
        console.log(data);
        var clients = await getSubscribersList(data, userData);
        if(clients.length > 0){
          setSubscribedClients(clients);
        }
        else{
          setSubscribedClients([]);
        }
        setIsLoading(false);
      }
    } catch(error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching. Contact admin.');
      setIsLoading(false);
    }
  };

  const openWorkoutPlan = async(planId,userData) => {
    navigate(`/workout-plan/${planId}/${userData.userId}`);
    console.log("The plan id of this workout is: ", planId);
  };

  const fetchWorkoutPlans = async(userData) => {
      setIsLoading(true);
      setError('');
      const jwtToken = userData.token;
      const trainerId = userData.userId;
      try{
        const response = await fetch(`https://cdnservice.azurewebsites.net/api/workoutplan/fetch/${trainerId}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
      });
      if(!response.ok){
        throw new Error("Failed to fetch workout plans");
      }
      const data = await response.json();
      setWorkOutPlans(data);
      setIsLoading(false);
    } catch(error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching. Contact admin.');
      setIsLoading(false);
    }
  };


  const displaySuccessMessage = () => {
    alert('Workout Plan Created Successfully!');
  };

  const displayDeleteSuccessMessage = () => {
    alert('Workout Plan Deleted Successfully!');
  };

  const handleScroll = () => {
    if (headerRef.current) {
        if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            headerRef.current.classList.add('sticky__header');
        } else {
            headerRef.current.classList.remove('sticky__header');
        }
    }
};
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
};

const onNavigate = (path) => {
    navigate(path);
};

return (
  <>
      <div className="header" ref={headerRef}>
          <img src="../assets/img/logo.png" alt="Company Logo" className="company-logo" onClick={() => onNavigate('/')} />
          <nav className="navigation">
              <ul>
                  <li onClick={() => onNavigate('/workout-plans')}>Workout Plans</li>
                  <li onClick={() => onNavigate('/appointments')}>Appointments</li>
                  <li onClick={() => onNavigate('/client-metrics')}>Client Metrics</li>
                  <li onClick={() => onNavigate('/clients')}>Subscribed Clients</li>
              </ul>
          </nav>

          <div className="profile-section">
              <button onClick={toggleProfileDropdown}>Hello, {UserFullName}</button>
              {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                      <button onClick={() => navigate('/change-profile')}>Change Profile</button>
                      <button onClick={() => onNavigate('/logout')}>Logout</button>
                  </div>
              )}
          </div>
      </div>
      <div className="professional-dashboard">
        <div className="chat-fab-container">
        <button className="chat-fab" onClick={() => connectToStreamChat(navigate)}>
          💬 Chat
        </button>
        </div>
          <h2>User Content Management</h2>
          {/* <button onClick={() => navigate('/video-upload')}>Create Workout Plan</button>
          <div className="section">
              <h3>Articles</h3>
              {articles.map(article => (
                  <div key={article.id} className="content-item">
                      <h4>{article.title}</h4>
                      <p>{article.content}</p>
                  </div>
              ))}
          </div> */}
           <form onSubmit={handleSubmit} className="upload-form">
                <h3>Create New Workout Plan</h3>
                <input type="text" placeholder="Plan Title" value={workoutPlanTitle} onChange={(e) => setworkoutPlanTitle(e.target.value)} required />
                <input type="text" placeholder="Plan Description" value={planDescription} onChange={(e) => setplanDescription(e.target.value)} required />
                <input type="text" placeholder="Plan Type" value={planType} onChange={(e) => setplanType(e.target.value)} required />
                <button type="submit">{isLoading ? 'Creating...' : 'Create Plan'}</button>
            </form>

            <div className="section">
              <h3>Workout Plans</h3>
              {workOutPlans.length === 0 ? (
                  <p>No Workout Plans Created</p>
              ) : (
                  workOutPlans.map(workOutPlan => (
                      <div key={workOutPlan._id} className="content-item">
                          <h4>{workOutPlan.title}</h4>
                          <p>Type: {workOutPlan.typeOfWorkout}</p>
                          <p>Created On: {workOutPlan.createdAt}</p>
                          <button onClick={() => openWorkoutPlan(workOutPlan._id, userData)}>Open</button>
                          <button onClick={() => deleteWorkoutPlan(workOutPlan._id)}>Delete</button>
                      </div>
                  ))
              )}
          </div>

          
          <div className="section">
                <h3>Unapproved Uploaded Content</h3>
                {unapprovedVideos.length === 0 ? (
                    <p>No Content Uploaded Yet!</p>
                ) : (
                    <ul>
                        {unapprovedVideos.map((video) => (
                            <li key={video._idid}>
                                <p>Title: {video.title}</p>
                                <p>Type: {video.typeOfWorkout}</p>
                                <p>Mode: {video.modeOfInstruction}</p>
                                <button onClick={() => openVideo(video._id)}>Open</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>



          <div className="section">
              <h3>Appointments</h3>
              <Calendar
                  localizer={localizer}
                  events={appointments}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
              />
          </div>
          <div className="section">
              <h3>Live Sessions</h3>
              {liveSessions.map(session => (
                  <div key={session.id} className="content-item">
                      <h4>{session.title}</h4>
                      <p>Date: {format(session.date, 'PPP', { locale: enUS })}</p>
                  </div>
              ))}
          </div>


          <div className="section">
              <h3>Client Progress Updates</h3>
              {progressUpdates.map(update => (
                  <div key={update.id} className="content-item">
                      <h4>{update.clientName}</h4>
                      <p>{update.update}</p>
                  </div>
              ))}
          </div>


          <div className="section">
              <h3>Supplement Recommendations</h3>
              {supplements.map(supplement => (
                  <div key={supplement.id} className="content-item">
                      <h4>{supplement.name}</h4>
                      <p>{supplement.benefit}</p>
                  </div>
              ))}
          </div>


           <div className="section">
              <div style={{ float: 'left', marginRight: '20px' }}>
                  <h3>Subscribed Clients Count: {subscribedClientsCount}</h3>
              </div>
              <div style={{ float: 'left' }}>
                  <h3>Subscribed Clients</h3>
                  {subscribedClients.length === 0 ? (
                      <p>No Subscribers</p>
                  ) : (
                      <ul>
                          {subscribedClients.map(client => (
                              <li key={client.userId}>
                                  {client.userFname} {client.userLname}<br/>
                                  Email: {client.userEmail}<br/>
                                  Gender: {client.userGender}
                              </li>
                          ))}
                      </ul>
                  )}
              </div>
              <div style={{ clear: 'both' }}></div>
          </div>
        </div>
  </>
);
};

export default ProfessionalDashboard;

