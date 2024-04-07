import React, { useState, useEffect } from 'react';
import '../styles/ProfessionalDashboard.css';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';

import parseISO from 'date-fns/parseISO';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addHours } from 'date-fns';

// Make sure these imports match your project structure
import enUS from 'date-fns/locale/en-US';

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
  
const ProfessionalDashboard = () => {
    // States for video uploads
    const [workoutPlanTitle, setworkoutPlanTitle] = useState('');
    const [planDescription, setplanDescription] = useState('');
    const [planType, setplanType] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [workOutPlans, setWorkOutPlans] = useState([]);
    const [videos, setVideos] = useState([]);
    const [articles, setArticles] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [progressUpdates, setProgressUpdates] = useState([]);
    const [supplements, setSupplements] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    const [subscribedClients, setSubscribedClients] = useState([]);
    const [error, setError] = useState(''); 
    

  useEffect(() => {
    // Mock fetch existing videos, articles, appointments, progress reports, and supplements
    
    setVideos([
        { id: 1, title: "30-Minute Cardio Session", url: "https://example.com/cardio-session" },
        { id: 2, title: "Yoga for Flexibility", url: "https://example.com/yoga-flexibility" },
    ]);

    const mockVideos = [
      { id: 1, title: "Yoga for Beginners", type: "Yoga", url: "https://example.com/yoga-beginners" },
      { id: 2, title: "10 Minute Zumba", type: "Zumba", url: "https://example.com/10-min-zumba" },
    ];

    setVideos(mockVideos);

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
        const endTime = addHours(startTime, 1); // Correctly adding 1 hour
        return { ...appointment, start: startTime, end: endTime };
      });
    
      setAppointments(convertedAppointments);
   

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


    const mockSubscribedClients = [
        { id: 1, name: "Prinston Rebello", subscriptionDate: "2023-01-15" },
        { id: 2, name: "Jane Doe", subscriptionDate: "2023-02-01" },
        { id: 3, name: "John Doe", subscriptionDate: "2023-02-15" },
        // Add more subscribed clients as needed
      ];
  
      setSubscribedClients(mockSubscribedClients);

  }, []);

  

  const handleSubmit = async(event) => {
      event.preventDefault();
      setIsLoading(true);
      setError('');
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log(userData);
      const trainerId = userData.userId;
      const jwtToken = userData.token;
      const title = workoutPlanTitle;
      const description = planDescription;
      const typeOfWorkout = planType;

      try{
        const response = await fetch('http://localhost:8000/api/workoutplan/add', { 
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
            fetchWorkoutPlans();
          } 
      } catch {
        console.error('Create error:', error);
        setError('An error occurred. Please try again later.');
      }   
  };

  const deleteWorkoutPlan = async(planId) => {
      setIsLoading(true);
      setError('');
      console.log(planId);
      const userData = JSON.parse(localStorage.getItem('user'));
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
        fetchWorkoutPlans();
      }
    } catch(error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching. Contact admin.');
      setIsLoading(false);
    }
  };

  const openWorkoutPlan = async(planId) => {

  };

  const fetchWorkoutPlans = async() => {
      setIsLoading(true);
      setError('');
      const userData = JSON.parse(localStorage.getItem('user'));
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

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const displaySuccessMessage = () => {
    alert('Workout Plan Created Successfully!');
};

const displayDeleteSuccessMessage = () => {
  alert('Workout Plan Deleted Successfully!');
};

  return (
    <div className="professional-dashboard">
            <h2>Professional Content Management</h2>
            
            {/* Upload Video Section */}
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
                          <button onClick={() => openWorkoutPlan(workOutPlan._id)}>Open</button>
                          <button onClick={() => deleteWorkoutPlan(workOutPlan._id)}>Delete</button>
                      </div>
                  ))
              )}
          </div>

            {/* Articles Section */}
            <div className="section">
                <h3>Articles</h3>
                {articles.map(article => (
                    <div key={article.id} className="content-item">
                        <h4>{article.title}</h4>
                        <p>{article.content}</p>
                    </div>
                ))}
            </div>
            
            {/* Appointments Calendar */}
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
            

            {/* Live Sessions */}
            {/* Live Sessions */}
<div className="section">
  <h3>Live Sessions</h3>
  {liveSessions.map(session => (
    <div key={session.id} className="content-item">
      <h4>{session.title}</h4>
      {/* Ensure the date is converted to string */}
      <p>Date: {format(session.date, 'PPP', { locale: enUS })}</p>
    </div>
  ))}
</div>
            
            {/* Progress Updates */}
            <div className="section">
                <h3>Client Progress Updates</h3>
                {progressUpdates.map(update => (
                    <div key={update.id} className="content-item">
                        <h4>{update.clientName}</h4>
                        <p>{update.update}</p>
                    </div>
                ))}
            </div>
            
            {/* Supplements Recommendations */}
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
            <h3>Subscribed Clients</h3>
            <ul>
  {subscribedClients.map(client => (
    <li key={client.id}>
      {client.name} (Subscribed on: {format(parseISO(client.subscriptionDate), 'PPP', { locale: enUS })})
    </li>
  ))}
</ul>
            </div>
        </div>
    );
} ;

export default ProfessionalDashboard;