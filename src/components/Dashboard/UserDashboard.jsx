import React, {useState} from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/UserDashboard.css'; // Adjust the path as needed
import ClientProgressDashboard from './ClientProgressDashboard.jsx'; // Adjust the import path as necessary

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





// A function to add events for each day
const createEvent = (dayOffset, title, startHour, endHour) => {
    const startDate = new Date(new Date().setHours(startHour, 0, 0, 0));
    const endDate = new Date(new Date().setHours(endHour, 0, 0, 0));
    return {
      title, // No times in the title
      start: addDays(startDate, dayOffset),
      end: addDays(endDate, dayOffset),
      allDay: false,
    };
};
  
  const generateFitnessSchedule = () => {
    const events = [];
    const daysInMonth = 28; // 4 weeks
    for (let day = 0; day < daysInMonth; day++) {
      const dayOfWeek = (new Date().getDay() + day) % 7;
      switch(dayOfWeek) {
        case 0: // Sunday: Rest day
          events.push(createEvent(day, 'Rest Day', 10, 11));
          break;
        case 1: // Monday: Strength Training + Yoga
        case 3: // Wednesday
        case 5: // Friday
          events.push(createEvent(day, 'Strength Training - Full Body', 9, 10));
          events.push(createEvent(day, 'Yoga Session', 18, 19));
          break;
        case 2: // Tuesday: Cardio + Zumba
        case 4: // Thursday
          events.push(createEvent(day, 'Morning Cardio', 7, 8));
          events.push(createEvent(day, 'Evening Zumba', 19, 20));
          break;
        case 6: // Saturday: Long Walk + Nutritional Planning
          events.push(createEvent(day, 'Morning Long Walk', 8, 9));
          events.push(createEvent(day, 'Nutritional Planning', 15, 16));
          break;
      }
      // Daily: Sleep Schedule (assuming constant)
      events.push(createEvent(day, 'Sleep', 22, 6)); // Sleep at 10 PM to 6 AM
    }
    return events;
  };


  // Mock data for subscribed trainers
const subscribedTrainers = [
    { id: 1, name: 'Alex Johnson', specialty: 'Strength Training' },
    { id: 2, name: 'Morgan Williams', specialty: 'Cardio Fitness' },
    { id: 3, name: 'Sam Smith', specialty: 'Yoga and Flexibility' },
    { id: 4, name: 'Taylor Brown', specialty: 'Nutrition' }
  ];
  
  // TrainerList subcomponent
  const TrainerList = ({ trainers }) => {
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

  const UserDashboard = () => {
    // User data from your example
    const user = {
      id: 1,
      fname: "Prinston",
      mname: "",
      lname: "Rebello",
      dob: "1997-11-29T00:00:00.000+00:00",
      gender: "male",
      username: "ddrake",
      email: "rebelloprinston29@gmail.com",
      role: "USER",
      enabled: true
    
    };
    const handleSearch = (filters) => {
      console.log('Searching with filters:', filters);
      // Here you would integrate the search logic or API call to fetch search results based on filters
    };
  
    const events = generateFitnessSchedule(); // Generate the user's fitness schedule
    
    const workoutPlan = {
  description: '4-week Intensive Strength and Conditioning Program',
  details: [
    {
      week: 1,
      focus: 'Full Body Conditioning',
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


    const EventAgenda = ({ event }) => {
        return (
          <div className="event-agenda-container">
            <strong className="event-agenda-title">{event.title}</strong>
          </div>
        );
      };


    return (
      <div style={{ height: '800px', margin: '50px' }}>
        
      <div className="user-dashboard">
      <h2>Workout Programs</h2>
      <SearchBar onSearch={handleSearch} />

      <h2>{user.fname}'s Fitness and Wellness Schedule</h2>

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
          style={{ height: '100%', margin: '0 auto' }
        }

        components={{
            event: EventAgenda, // Custom component for events
          }}
        />


        <TrainerList trainers={subscribedTrainers} />
        <ClientProgressDashboard 
              workoutPlan={workoutPlan}
               progressMetrics={workoutPlan.metrics}
        />



<div className="chat-fab-container">
  <button className="chat-fab" onClick={() => {/* Open chat */}}>
    💬 Chat
  </button>
</div>
      </div>

      </div>
      </div>
    );

  };

  export default UserDashboard;