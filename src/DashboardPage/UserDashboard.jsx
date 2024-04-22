import React, { useState, useEffect, useRef } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/UserDashboard.css'; 
import ClientProgressDashboard from '../DashboardPage/ClientProgressDashboard.jsx'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import Modal from 'react-modal';
import logo from '../assests/img/logo.png';


const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const getUserData = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  return userData;
}
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

const UserDashboard = () => {

  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [UserFullName, setUserFullName] = useState('');
  const [error, setError] = useState(''); 
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const[starttime,SetStartTime]  =useState();
  const[endtime,SetEndTime]  =useState();
  const[eventTitle,SetTitle]  =useState();
  const[date,setDate]=useState();
  const[Workout,setWorkout]  =useState();
  const [trainers, setTrainers] = useState(null);
  const [trainerPlans, setTrainerPlans] = useState({});
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const TrainingvideosRef = useRef(null);
  const workoutplansRef = useRef(null);
  const MetricsRef = useRef(null);
  const sessionsRef = useRef(null)
  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);
  const clientDashboardRef = useRef();
  const [subscribedTrainerIds, setSubscribedTrainerIds] = useState([]);
  const [yourWorkoutPlans, setYourWorkoutPlans] = useState([]);
  const [isViewing, setIsViewing] = useState(false);
  const [SubscribedTrainers, setSubscribedTrainers] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);


   const scrollToTrainingVideos = () => {
    if (clientDashboardRef.current) {
      clientDashboardRef.current.scrollToTrainingVideos();
    }
  };

  useEffect(() => {  
    const userData = getUserData();
    getUserFullName();
    generateFitnessSchedule(userData);
    generateMealSchedule(userData);
    fetchTrainerIds(userData);
    setTimeout(() => setIsLoaded(true), 500); // Simulating a loading delay
    //fetchSubscribedPlans(userData, subscribedTrainerIds);  
    // if (!subscribedTrainerIds) return;
    // fetchSubscribedPlans(subscribedTrainerIds).catch(console.error);
    if (subscribedTrainerIds.length > 0) {
      console.log("now to fetch plans");
      fetchSubscribedPlans(userData, subscribedTrainerIds);
  }
}, [subscribedTrainerIds]); 
 
  
  const handleSelectSlot = ({ start, end }) => {
    SetStartTime(format(start, 'HH:mm:ss'));  // format time properly
    SetEndTime(format(end, 'HH:mm:ss'));
    setDate(format(start, 'yyyy-MM-dd')); // assuming you want the date from the start
    setModalOpen(true);
    setIsViewing(false);
  };
  
  const handleSelectEvent = (event) => {
    SetTitle(event.eventTitle);
    setDate(format(new Date(event.start), 'yyyy-MM-dd'));
    SetStartTime(format(new Date(event.start), 'HH:mm:ss'));
    SetEndTime(format(new Date(event.end), 'HH:mm:ss'));
    setWorkout(event.workout); // assuming workout type is stored in event
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
    setWorkout('');  // Reset workout type
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1, // Simplistic approach for unique ID; better use UUIDs
      title: eventTitle,
      date: date,
      startTime: starttime,
      endTime: endtime,
      workout: Workout
    };
    
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
    const jwtToken = userData.token;
    const day  = date;
    const startTime = starttime;
    const title= eventTitle;
    const endTime= endtime;
    const workout = Workout;
    const userId = userData.userId;

    try{
      const response = await fetch(`http://localhost:8080/timetables/createForUser?userId=${userId}`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ userId, title, day, workout, startTime,endTime }),
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
          const response = await fetch(`http://localhost:8080/timetables/delete?timetableId=${id}`, {
            method: 'DELETE',
            // headers: {
            //   'Authorization': `Bearer ${jwtToken}`
            // },
          });
          console.log(response);
      
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
      
      const getUserFullName = async() => {
        const userData = getUserData();
        var fullName = userData.fname ;
        setUserFullName(fullName)   ;
      };

const generateFitnessSchedule = async(userData) => {
    setIsLoading(true);
    setError('');
    const jwtToken = userData.token;
    var userId =userData.userId;

    try{
      const response = await fetch(`http://localhost:8080/timetables/getByUser?userId=${userId}`, { 
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


  const EventAgenda = ({ event }) => {
          return (
            <div className="event-agenda-container">
              <strong className="event-agenda-title">{event.title}</strong>
            </div>
          );
        };
  
        // TrainerList subcomponent
        const TrainerList = ({ trainers }) => {
          if (!trainers) return <div></div>; 
          
          return (
            <div className="trainer-list">
              <h3>Subscribed Trainers</h3>
              <ul>
                {trainers.map(trainer => (
                  <li key={trainer.id}>
                    <strong>{trainer.name}</strong> - {trainer.specialty}
                  </li>
                ))}
              </ul>
            </div>
          );
        };

    const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [location, setLocation] = useState('');
    const [mode, setMode] = useState('');
    const [type, setType] = useState('');

  
    const handleSearch = (e) => {
      e.preventDefault();
      onSearch({ searchTerm, specialty, location, mode, type });
    };


    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search professionals or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
          <option value="">Specialty</option>
          <option value="Yoga">Yoga</option>
          <option value="Zumba">Zumba</option>
          <option value="Weight training">Weight Training</option>
          {/* ...other specialties */}
        </select>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">Mode of Instruction</option>
          <option value="Video">Videos</option>
          <option value="Plan">Plans</option>
          {/* ...other modes */}
        </select>


        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Type of Workout</option>
          <option value="Home">Home</option>
          <option value="Gym">Gym</option>
          <option value="Fitness center">Fitness Center</option>
          {/* ...other types */}
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
    );
  }; 


  const getTrainerList = async(userData, trainerIds) => {
    setIsLoading(true);
    setError('');
    const trainerList = [];
    const jwtToken = userData.token;
    for(const subId of trainerIds){
        try{
            const response = await fetch(`https://login-service.azurewebsites.net/users/getdetails?userId=${subId}`, { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`
            },
          });
          if(!response.ok){
            throw new Error("Failed to fetch trainers");
          }
          else{
            const data = await response.json();
            trainerList.push(data);
          } 
        }catch (error) {
          console.error("Error fetching user info for trainer ID:", subId, error); // Log any errors from getUserInfo
          // Handle the error as needed, e.g., continue processing other user IDs
        }
      }
      setIsLoading(false);
      return trainerList;
    };

    // Get the array of subscribed trainers from backend 
    const fetchTrainerIds = async (userData) => {
      const jwtToken = userData.token;
      try {
        const response = await fetch(`https://cdnservice.azurewebsites.net/api/users/getsub/${userData.userId}`, {
          method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
        });  
        const data = await response.json();
        if (Array.isArray(data)) {
          setSubscribedTrainerIds(data);
          console.log("setting data");
          console.log("now to fetch plans");
          var trainers = await getTrainerList(userData, subscribedTrainerIds);
          if(trainers.length > 0){
            setSubscribedTrainers(trainers);
          }
          else{
            setSubscribedTrainers([]);
          }
          fetchSubscribedPlans(userData, subscribedTrainerIds)
        } else {
          console.error('Expected an array but got:', data);
          setSubscribedTrainerIds([]);  // Ensure it's always an array
        }
      } catch (error) {
        console.error('Failed to fetch trainerIds', error);
        setSubscribedTrainerIds([]);
      }

      
    };
    // Get the array of subscribed trainers from backend 

    const fetchSubscribedPlans = async (userData, subscribedTrainerIds) => {
      setIsLoading(true); 
      setError(''); 
      console.log("Subscribed Trainer IDs:", subscribedTrainerIds);
      console.log(subscribedTrainerIds);
      const jwtToken = userData.token;
      const plans = {};
  
      for (const trainerId of subscribedTrainerIds) {
          try {
              const response = await fetch(`https://cdnservice.azurewebsites.net/api/workoutplan/fetch/${trainerId}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${jwtToken}`
                  },
              });
              
              if (!response.ok) {
                  throw new Error(`Failed to fetch plans for trainer ${trainerId}`);
              }
  
              const data = await response.json();
              //console.log(data);
              plans[trainerId] = data.map(plan => ({ ...plan, trainerId }));
              
          } catch (error) {
              console.error('Failed to fetch plans for trainer', trainerId, error);
              setError(`Error fetching plans for trainer ${trainerId}. ${error.message}`);
              
          }
      }
      const allPlans = Object.values(plans).flat();
      setYourWorkoutPlans(allPlans); 
      setIsLoading(false);
  };
  

    const handleSearch = (filters) => {
      console.log('Searching with filters:', filters);
      // Here you would integrate the search logic or API call to fetch search results based on filters
    };

    const openWorkoutPlan = async(planId, trainerId) => {
      navigate(`/workout-plan/${planId}/${trainerId}`);
      console.log("The plan id of this workout is: ", planId);
    };
      
  const workoutPlan = { // your workout plans 
  description: '4-week Intensive Strength and Conditioning Program', // description
  details: [
    {
      week: 1,
      focus: 'Full Body Conditioning', //title
      sessions: [
        { day: 'Monday', exercises: ['Squats', 'Deadlifts', 'Bench Press'], notes: '3 sets of 12 reps' },
        { day: 'Wednesday', exercises: ['Pull-Ups', 'Leg Press', 'Shoulder Press'], notes: '3 sets of 10 reps' },
        { day: 'Friday', exercises: ['Lunges', 'Push-Ups', 'Planks'], notes: '4 sets till failure' },
      ],
    },
    // ... Additional weeks
  ],


  caloriesBurnt: 5000,
  goalProgress: 0.75, // 75%
  metrics: [
    { id: 'strength', name: 'Strength', value: '80%' },
    { id: 'flexibility', name: 'Flexibility', value: '60%' },
    { id: 'endurance', name: 'Endurance', value: '50%' },
    // ... Additional metrics
  ],
  
  nutrition: [
    { mealTime: 'Breakfast', items: ['Oatmeal', 'Protein Shake', 'Banana'] },
    { mealTime: 'Lunch', items: ['Grilled Chicken', 'Quinoa', 'Salad'] },
    { mealTime: 'Dinner', items: ['Salmon', 'Sweet Potatoes', 'Steamed Veggies'] },
    // ... Additional meals/snacks
  ],



  supplements: ['Whey Protein', 'BCAAs', 'Multivitamin'],
};

const generateMealSchedule = async(userData) => {
  setIsLoading(true);
  setError('');
  const jwtToken = userData.token;
  var userId =userData.userId;

  try{
    const response = await fetch(`http://localhost:8080/mealplan/getByUser?userId=${userId}`, { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
  });

  if(!response.ok){
    throw new Error("Failed to fetch meal plan");
  }

  
  const data = await response.json();

    // Map fetched data to the required format
    const formattedMealPlans = data.map(plan => ({
      id: plan.id,
      title: plan.title + " (Meal)",
      start: new Date(`${plan.day}T${plan.startTime}`),
      end: new Date(`${plan.day}T${plan.endTime}`),
      allDay: false,
      type: 'meal'
    }));

    setEvents(currentEvents => [...currentEvents, ...formattedMealPlans]);
  } catch (error) {
    console.error('Fetch error:', error);
    setError('An error occurred while fetching meal plans. Please try again later.');
  } finally {
    setIsLoading(false);
  }
};

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
      const handleLogout = () => {
        // Clear local storage or any other clean-ups.
        navigate('/login');
    };

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
              <button onClick={() => clientDashboardRef.current.scrollToTrainingVideos()}>Training Videos</button>            
              <button onClick={() => clientDashboardRef.current.scrollToSessions()}>Sessions</button>
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
        
      <div className="user-dashboard">
      

      {/* <h2> Workout Programs </h2>
      <SearchBar onSearch={handleSearch} /> */}

      <h2> {UserFullName}'s Fitness and Wellness Schedule</h2>

            {/* <div className="search-bar-container">
              <div className="search-results-header">
                <span className="results-count">36 Results</span>
                <div className="sort-options">
                  <label htmlFor="sort">Newest First</label>
                  <select id="sort">
                  </select>
                </div>
              </div> 
            </div> */}

    <div className="dashboard-grid">
      {/* Row 1 */}
    <section className="calendar-section">
              <h3>Calendar</h3>  
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                eventPropGetter={(event) => {
                  return {
                    style: {
                      backgroundColor: event.type === 'meal' ? '#fdae6b' : '#3174ad' // Different colors for meal plans and other events
                    }
                  };
                }}
                components={{
                  event: EventAgenda, // Customize how events are rendered if necessary
                }}
              />
      {modalOpen && (
            <Modal isOpen={modalOpen} onRequestClose={handleCloseModal} contentLabel="Event Details"  className="YourCustomModalClass">
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
        <button type="button" onClick={() => { handleEventDelete(currentEventId); handleCloseModal(); }}>Delete Event</button>
        <button type="button" onClick={handleCloseModal}>Close</button>
      </>
    ) : (
<>            <h2> Create your own schedule </h2> 
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
                <select
                  value={Workout}
                  onChange={(e) => setWorkout(e.target.value)}
                >
                  <option value="">Select Workout Type</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength Training</option>
                  <option value="Zumba">Zumba</option>
                  </select>
                  <button type="submit"> Create</button> 
                 <button type="button" onClick={handleCloseModal}>Cancel</button>
                </form>
                </div>
                </>
              )}
              </div>
          </Modal>)}
        </section>
    
     
        <section className="trainer-list-section">
          <h3>Trainer List</h3>
          <TrainerList trainers={trainers} />
        </section>
    </div>

    <section ref={MetricsRef} className="progress-overview-section">
      <h2>Health & Fitness Dashboard</h2>        
         <ClientProgressDashboard 
               workoutPlan={workoutPlan}
               progressMetrics={workoutPlan.metrics}
              // yourPlans={trainerPlans} 
              
        />
       </section>
      
      
      <div ref={workoutplansRef} className="section-workout">
          <h3>Your Subscribed Workout Plans</h3>
          {yourWorkoutPlans.length === 0 ? (
              <p>No Subscribed Plans</p>
          ) : (
            yourWorkoutPlans.map(plan => (
              <div key={plan._id} className="content-item">
                <div>
                  <h4>{plan.title}</h4>
                  <p>Type: {plan.typeOfWorkout}</p>
                  <p className="created-timestamp">Created On: {new Date(plan.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="open-btn" onClick={() => openWorkoutPlan(plan._id, plan.trainerId)}>Open</button>
              </div>
            ))
          )
          }
      </div>

    


        <div className="chat-fab-container">
          <button className="chat-fab" onClick={() => connectToStreamChat(navigate)}>
            💬 Chat
          </button>
        </div>
      </div>
  
</>
);
  };

  export default UserDashboard;