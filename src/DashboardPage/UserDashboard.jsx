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

const UserDashboard = () => {

  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [UserFullName, setUserFullName] = useState('');
  const [error, setError] = useState(''); 
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const[starttime,SetStartTime]  =useState(false);
  const[endtime,SetEndTime]  =useState(false);
  const[eventTitle,SetTitle]  =useState(false);
  const[date,setDate]=useState(false);
  const[Workout,setWorkout]  =useState(false);
  const [trainers, setTrainers] = useState(null);
  const [trainerPlans, setTrainerPlans] = useState({});
  const [currentEventId, setCurrentEventId] = useState(null);
  const [subscribedTrainerIds, setSubscribedTrainerIds] = useState([]);
  const [yourWorkoutPlans, setYourWorkoutPlans] = useState([]);


  useEffect(() => {  
    const userData = getUserData();
    getUserFullName();
    generateFitnessSchedule(userData);
    fetchTrainerIds(userData);
    // setTimeout(() => setIsLoaded(true), 500); // Simulating a loading delay
    fetchSubscribedPlans(userData, subscribedTrainerIds);  
    // if (!subscribedTrainerIds) return;
    // fetchSubscribedPlans(subscribedTrainerIds).catch(console.error);

  }, []);
  
  const handleSelectSlot = ({ start, end }) => {
    SetStartTime(format(start, 'HH:mm:ss'));  // format time properly
    SetEndTime(format(end, 'HH:mm:ss'));
    setDate(format(start, 'yyyy-MM-dd')); // assuming you want the date from the start
    setModalOpen(true);
  };
  
  const handleSelectEvent = (event) => {
    SetTitle(event.eventTitle);
    setDate(format(new Date(event.start), 'yyyy-MM-dd'));
    SetStartTime(format(new Date(event.start), 'HH:mm:ss'));
    SetEndTime(format(new Date(event.end), 'HH:mm:ss'));
    setWorkout(event.workout); // assuming workout type is stored in event
    setModalOpen(true);
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
  };


  const createNewEvent = async(event) => {
    setEvents([...events, { ...event, id: events.length + 1 }]);
    const userData = getUserData();

    console.log(userData);
    const jwtToken = userData.token;
    const day  = date;
    const startTime = starttime;
    const title= eventTitle;
    const endTime= endtime;
    const workout = Workout;
    const userId = userData.userId;

    try{
      const response = await fetch(`http://localhost:8080/timetables/create/user/${userId}`, { 
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
        setEvents(events.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt));
      };

      const handleEventDelete = () => {
        setEvents(events.filter(evt => evt.id !== currentEventId));
        handleCloseModal();
      };


 
  const getUserFullName = async() => {
    const userData = getUserData();
    var fullName = userData.fname;
    setUserFullName(fullName);
  };


  const generateFitnessSchedule = async(userData) => {
    setIsLoading(true);
    setError('');
    const jwtToken = userData.token;
    var userId =userData.userId;

    try{
      const response = await fetch(`http://localhost:8080/timetables/get/user/${userId}`, { 

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
    setEvents(data);
    setIsLoading(false);

  } catch(error) {
    console.error('Fetch error:', error);
    setError('An error occurred while fetching. Contact admin.');
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
  
  const subscribedTrainers = [
          { id: 1, name: 'Alex Johnson', specialty: 'Strength Training' },
          { id: 2, name: 'Morgan Williams', specialty: 'Cardio Fitness' },
          { id: 3, name: 'Sam Smith', specialty: 'Yoga and Flexibility' },
          { id: 4, name: 'Taylor Brown', specialty: 'Nutrition' }
        ];
        
        // TrainerList subcomponent
        const TrainerList = ({ trainers }) => {
          if (!trainers) return <div>Loading trainers...</div>; 
          
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

    // Get the array of subscribed trainers from backend 

    const fetchTrainerIds = async (userData) => {
      try {
        const jwtToken = userData.token;
        const response = await fetch(`http://localhost:8000/api/users/getsub/${userData.userId}`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
        });  
        const data = await response.json();
        //console.log(data);
        setSubscribedTrainerIds(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch trainerIds', error);
      }
    };

    const fetchSubscribedPlans = async (userData, subscribedTrainerIds) => {
      setIsLoading(true); 
      setError(''); 
      console.log(subscribedTrainerIds);
      const jwtToken = userData.token;
      const plans = {};
  
      for (const trainerId of subscribedTrainerIds) {
          try {
              const response = await fetch(`http://localhost:8000/api/workoutplan/fetch/${trainerId}`, {
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


 return (
      <div style={{ height: '800px', margin: '50px' }}>
        
      <div className="user-dashboard">
      <h2>Workout Programs</h2>
      <SearchBar onSearch={handleSearch} />

      <h2> {UserFullName}'s Fitness and Wellness Schedule</h2>

      <div className="search-bar-container">
        {/* Optional: Add sort and filter options here if needed */}
        <div className="search-results-header">
          <span className="results-count">36 Results</span>
          <div className="sort-options">
            <label htmlFor="sort">Newest First</label>
            <select id="sort">
              {/* Options for sorting */}
            </select>
          </div>
        </div> 
 
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          components={{
            event: EventAgenda, 
          }}
        />
      
          {modalOpen && (
            <Modal isOpen={modalOpen} onRequestClose={handleCloseModal} contentLabel="Event Details">
              {/* <h2>{selectedEvent.id ? 'Edit Event' : 'Add Event'}</h2> */}
              <form onSubmit={handleEventSubmit}>
              <input
            type="text"
            placeholder="Event Title"
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
            <button type="submit">{eventTitle ? 'Update' : 'Create'}</button> {/* Assume update if title is non-empty */}
            {eventTitle && <button type="button" onClick={handleEventDelete}>Delete</button>}
            <button type="button" onClick={handleCloseModal}>Cancel</button>
          </form>
            </Modal>
                )}

     
        <TrainerList trainers={trainers} />
        
        <ClientProgressDashboard 
              workoutPlan={workoutPlan}
               progressMetrics={workoutPlan.metrics}
               yourPlans={trainerPlans}
        />

      <div className="section">
          <h3>Your Subscribed Workout Plans</h3>
          {yourWorkoutPlans.length === 0 ? (
              <p>No Subscribed Plans</p>
          ) : (
            yourWorkoutPlans.map(plan => (
                  <div key={plan._id} className="content-item">
                      <h4>{plan.title}</h4>
                      <p>Type: {plan.typeOfWorkout}</p>
                      <p>Created On: {plan.createdAt}</p>
                      <button onClick={() => openWorkoutPlan(plan._id, plan.trainerId)}>Open</button>
                  </div>
              ))
          )}
      </div>


        <div className="chat-fab-container">
          <button className="chat-fab" onClick={() => connectToStreamChat(navigate)}>
            💬 Chat
          </button>
        </div>
      </div>
    </div>
  </div>
);
  };

  export default UserDashboard;