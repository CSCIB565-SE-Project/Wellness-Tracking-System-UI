import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import parseISO from 'date-fns/parseISO';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import logo from '../assests/img/logo.png';
import '../styles/ProfessionalDashboard.css';



//A function to connect to the chat

const connectToStreamChat = async (navigate) => {
  const apiKey = 'v5zqy2qw283c';
  const client = StreamChat.getInstance(apiKey);
  const userData = JSON.parse(localStorage.getItem('user'));
  const authToken = userData ? userData.token : null;

  try {
      const response = await fetch('https://localhost:8005/auth/verifyToken', {
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
    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [starttime,SetStartTime]  =useState();
    const [endtime,SetEndTime]  =useState();
    const [eventTitle,SetTitle]  =useState();
    const [date,setDate]=useState();
    const [Workout,setWorkout]  =useState();
    const [currentEventId, setCurrentEventId] = useState(null);
    const appointmentcalender = useRef(null);
    const workoutplansRef = useRef(null);
    const MetricsRef = useRef(null);
    const sessionsRef = useRef(null);
    const subscribedclients=useRef(null);
    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);
    const [userData, setUserData] = useState(null);
    const [isViewing, setIsViewing] = useState(false);
    const [stramKey, setStreamKey] = useState('');
    const [streamPoint, setStreamPoint] = useState('');


    useEffect(() => {
      const userData = getUserData();
      if (userData) {
        setUserData(userData);  
      }
      getUserFullName();
      generateappointments(userData);
      fetchWorkoutPlans(userData);
      fetchSubscribedClients(userData);
      fetchSubscribedCount(userData);
      fetchUnapprovedVideos(userData);
      getStreamKey();
      getStreamPoint();
   
    const mockArticles = [
      { id: 1, title: "Benefits of Yoga", content: "Yoga improves flexibility, strength, and mental well-being." },
      { id: 2, title: "Why Cardio is Vital", content: "Cardiovascular exercise increases heart health and stamina." },
    ];

    setArticles(mockArticles);

    // const mockAppointments = [
    //     { id: 1, date: "2023-10-01", time: "10:00", client: "John Doe", sessionType: "Personal Training" },
    //     { id: 2, date: "2023-10-03", time: "12:00", client: "Jane Smith", sessionType: "Yoga" },
    //   ];
    
    //   const convertedAppointments = mockAppointments.map(appointment => {
    //     const startTime = parseISO(`${appointment.date}T${appointment.time}`);
    //     const endTime = addHours(startTime, 1); 
    //     return { ...appointment, start: startTime, end: endTime };
    //   });
    
    //   setAppointments(convertedAppointments);
   
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

    
  const handleSelectSlot = ({ start, end }) => {
    SetStartTime(format(start, 'HH:mm'));  // format time properly
    SetEndTime(format(end, 'HH:mm'));
    setDate(format(start, 'yyyy-MM-dd')); // assuming you want the date from the start
    setModalOpen(true);
    setIsViewing(false);
  };
  
  const handleSelectEvent = (event) => {
    SetTitle(event.eventTitle);
    setDate(format(new Date(event.start), 'yyyy-MM-dd'));
    SetStartTime(format(new Date(event.start), 'HH:mm'));
    SetEndTime(format(new Date(event.end), 'HH:mm'));
    setCurrentEventId(event.id);
    setModalOpen(true);
    setIsViewing(true);

  };

  const handleCloseModal = () => {
    setModalOpen(false);
    SetTitle('');  // Reset title
    setDate('');  // Reset date
    SetStartTime('');  // Reset start time
    SetEndTime('');  // Reset end time
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1, // Simplistic approach for unique ID; better use UUIDs
      title: eventTitle,
      date: date,
      startTime: starttime,
      endTime: endtime,
    };

    console.log(newEvent);
    if (currentEventId) { // Assume currentEventId tracks the event being edited
      updateEvent(newEvent);
    } else {
      createNewEvent(newEvent);
    }
    handleCloseModal(); // Close modal after action
  };

  const createNewEvent = async (event) => {
    const updatedEvents = [...events, { ...event, id: events.length + 1 }];  
    setEvents(updatedEvents);
    const userData = getUserData();
    console.log(userData);
    const jwtToken = userData.token;
    const day = date;
    console.log('dayyyy:',day);
    const startTime = starttime;
    const title= eventTitle;
    const endTime= endtime;
    const trainerId = userData.userId;

    try{
      const response = await fetch(`http://localhost:8080/appointments/createForTrainer?trainerId=${trainerId}`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ trainerId, title, day, startTime,endTime }),
        });

        console.log(response);
        const data = await response.json();
        if (data) {
          console.log('Workout Plan Created Successfully!', data);
        }}

      catch{
        
        console.error('Create error:', error);
        setError('An error occurred. Please try again later.');
      
      }
      };
      const updateEvent = (updatedEvent) => {
        const updatedEvents = events.map(evt => 
          evt.id === updatedEvent.id ? updatedEvent : evt // Mapping and checking for the id
        );
        setEvents(updatedEvents); // Setting the updated events array to state
      };

      // const handleEventDelete = () => {
      //   setEvents(events.filter(evt => evt.id !== currentEventId));
      //   handleCloseModal();
      // };

    const handleEventDelete = async () => {
        const userData = getUserData();
        const id = currentEventId;
      
        try {
          // Send delete request to the server
          const response = await fetch(`http://localhost:8080/appointments/deleteForTrainer?appointmentId=${id}`, {
            method: 'DELETE',         
          });
      
          if (!response.ok) {
            throw new Error("Failed to delete the event.");
          }
      
          // Update the local events state to reflect the deletion
          const updatedEvents = events.filter(event => event.id !== id);
          setEvents(updatedEvents);
          setCurrentEventId(null); // Reset the current event ID
          setModalOpen(false); // Close the modal
      
        } catch (error) {
          console.error('Delete error:', error);
          setError('An error occurred while deleting the event. Please try again later.');
        }
      };


    const generateappointments = async(userData) => {
      setIsLoading(true);
      setError('');
      const jwtToken = userData.token;
      var trainerId =userData.userId;
   
      try{
        const response = await fetch(`http://localhost:8080/appointments/byTrainer?trainerId=${trainerId}`, { 
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
      });
   
      if(!response.ok){
        throw new Error("Failed to fetch appointment");
      }
   
      console.log(response);
      const data = await response.json();
      console.log(data);
   
        // Map fetched data to the required format
      const formattedEvents = data.map(event => {
          // Combine date and time fields to create start and end Date objects
          const startDateTime = new Date(`${event.day}T${event.startTime}`);
          const endDateTime = new Date(`${event.day}T${event.endTime}`);
   
          return {
            id: event.id,
            title: event.title,
            start: startDateTime,
            end: endDateTime,
            date: event.day,
          };
        }
      );

        setEvents(formattedEvents);
        setIsLoading(false);

      } catch (error) {
        console.error('Fetch error:', error);
        setError('An error occurred while fetching events. Contact admin.');
        setIsLoading(false);
      }
    };

  const fetchUnapprovedVideos = async (userData) => {
      setIsLoading(true);
      setError('');
      const jwtToken = userData.token;
      const trainerId = userData.userId;
      try{
        const response = await fetch(`https://localhost:8000/api/videos/unapproved/${trainerId}`, { 
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

      try{
        const response = await fetch('http://localhost:8000/api/workoutplan/add', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ trainerId, title, description }),
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
        const response = await fetch(`http://localhost:8000/api/workoutplan/delete/${planId}`, { 
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
      console.log(subscribedClients);
      setIsLoading(false);
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
      const response = await fetch(`http://localhost:8000/api/trainers/subc/${trainerId}`, { 
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
        const response = await fetch(`http://localhost:8000/api/workoutplan/fetch/${trainerId}`, { 
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

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
};

const handleLogout = () => {
  // Clear local storage or any other clean-ups.
  navigate('/login');
};

const handleClientClick = () => {

}

const getStreamKey = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('http://live-streaming-service.azurewebsites.net/channel/getKey/test1');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const sessions = await response.text();
        setStreamKey(sessions);
    } catch (error) {
        console.error('Failed to fetch live sessions:', error);
        setError('Failed to load live sessions.');
    } finally {
        setIsLoading(false);
    }
};

const getStreamPoint = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('http://live-streaming-service.azurewebsites.net/channel/getPoint/test1');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const sessions = await response.text();
        setStreamPoint(sessions);
    } catch (error) {
        console.error('Failed to fetch live sessions:', error);
        setError('Failed to load live sessions.');
    } finally {
        setIsLoading(false);
    }
};

console.log(userData);


return (
  <>
       <header className="dashboard-header">
            <div className="logo-container">
              <img src={logo} alt="Company Logo" onClick={() => navigate('/')} />
              <h1>Fit Inc.</h1>
            </div>

            <nav className="main-nav">
              {/* Define these functions to handle navigation or simply use `navigate` */}
              <button onClick={() => scrollToRef(MetricsRef)}>Metrics</button>
              <button onClick={() => scrollToRef()}>Training Videos</button>            
              <button onClick={() => scrollToRef()}>Sessions</button>
              <button onClick={() => scrollToRef(workoutplansRef)}>Workout Plans</button>

            </nav>

            <div className="user-section">
            <button onClick={toggleProfileDropdown}>Hello,{UserFullName}</button>
            {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <button onClick={() => navigate('/login')}>Change Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>


      <div className="professional-dashboard">
          <div className="chat-fab-container">
              <button className="chat-fab" onClick={() => connectToStreamChat(navigate)}>
                  💬 Chat
              </button>
          </div>
          <h2>User Content Management</h2>

          <form onSubmit={handleSubmit} className="upload-form">
              <h3>Create New Workout Plan</h3>
              <input type="text" placeholder="Plan Title" value={workoutPlanTitle}
                     onChange={(e) => setworkoutPlanTitle(e.target.value)} required/>
              <input type="text" placeholder="Plan Description" value={planDescription}
                     onChange={(e) => setplanDescription(e.target.value)} required/>
              <input type="text" placeholder="Plan Type" value={planType} onChange={(e) => setplanType(e.target.value)}
                     required/>
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
                          <li key={video._id}>
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
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{height: 500}}
                  selectable
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
              />
              {modalOpen && (
                  <Modal isOpen={modalOpen} onRequestClose={handleCloseModal} contentLabel="Event Details"
                         className="YourCustomModalClass">
                      <div className={isViewing ? "view-event-modal-content" : "create-event-modal-content"}>
                          {isViewing ? (
                              // Content when viewing an existing event
                              <>
                                  <h2>Event Details</h2>
                                  <p>Title: {eventTitle}</p>
                                  <p>Date: {date}</p>
                                  <p>Start Time: {starttime}</p>
                                  <p>End Time: {endtime}</p>
                                  <p>Workout Type: {Workout}</p>
                                  <button type="button" onClick={() => {
                                      handleEventDelete(currentEventId);
                                      handleCloseModal();
                                  }}>Delete Event
                                  </button>
                                  <button type="button" onClick={handleCloseModal}>Close</button>
                              </>
                          ) : (
                              <>
                                  <h2> Create appointments </h2>
                                  <div className="modal-content">
                                      <form onSubmit={handleEventSubmit}>
                                          <input
                                              type="text"
                                              placeholder="Enter Event Title"
                                              value={eventTitle}
                                              onChange={(e) => SetTitle(e.target.value)}
                                          />
                                          <input
                                              type="date"
                                              value={date}
                                              onChange={(e) => setDate(e.target.value)}
                                          />
                                          <input
                                              type="time"
                                              value={starttime}
                                              onChange={(e) => SetStartTime(e.target.value)}
                                          />
                                          <input
                                              type="time"
                                              value={endtime}
                                              onChange={(e) => SetEndTime(e.target.value)}
                                          />

                                          <button type="submit"> Create</button>
                                          <button type="button" onClick={handleCloseModal}>Cancel</button>
                                      </form>
                                  </div>
                              </>
                          )}
                      </div>
                  </Modal>)}
          </div>
          <div className="section">
              <h3>Live Sessions</h3>
              {liveSessions.map(session => (
                  <div key={session.id} className="content-item">
                      <h4>{session.title}</h4>
                      <p>Date: {format(session.date, 'PPP', {locale: enUS})}</p>{/* Display the session location */}
                  </div>
              ))}
              <div> StreamKey: {stramKey}</div>
              <div> IngestPoint: {streamPoint}</div>
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
              <div style={{float: 'left', marginRight: '20px'}}>
                  <h3>Subscribed Clients Count: {subscribedClientsCount}</h3>
              </div>
              <div style={{float: 'left'}}>
                  <h3>Subscribed Clients</h3>
                  {subscribedClients.length === 0 ? (
                      <p>No Subscribers</p>
                  ) : (
                      <ul>
                          {subscribedClients.map((clientArray, index) => (
                              <li key={index}>
                                  {clientArray.map((client) => (
                                      <div key={client._id}>
                                          <button onClick={() => handleClientClick(client)}>
                                              <p>{client.userFname} {client.userLName} - Email: {client.userEmail}</p>
                                          </button>
                                      </div>
                                  ))}
                              </li>
                          ))}
                      </ul>
                  )}
              </div>
              <div style={{clear: 'both'}}></div>
          </div>
      </div>
  </>
)
};

export default ProfessionalDashboard;
