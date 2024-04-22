

import React, { useEffect, useState,useRef ,useImperativeHandle} from 'react';



import { Doughnut, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/ClientProgressDashboard.css'; 

const getUserData = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  return userData;
}
const ClientProgressDashboard = React.forwardRef(({ workoutPlan, dailyMeals = [],  yourPlans },ref) => {
  // Example data for charts
  const progressData = {
    labels: workoutPlan.metrics.map(metric => metric.name),
    datasets: [{
      label: 'Current Progress',
      data: workoutPlan.metrics.map(metric => parseFloat(metric.value)),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const [progressMetrics, setProgressMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [upcomingVideos , setupcomingVideos]=useState([]);

  useEffect(() => {
        const userData = getUserData();
        upcomingvideos(userData);

        console.log("Fetching progress metrics..."); // Log at the beginning of useEffect
        const fetchProgressMetrics = async (userData) => {
        if (!userData) return;
        setIsLoading(true);
        setError(null);
        const jwtToken = userData.token;
        const userId = userData.userId;
    
try {
 const response = await fetch(`http://localhost:8080/progress-metrics/get?userId=${userId}` ,
 {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
      },

      });
      console.log("Response:", response); 
      if (!response.ok) {
        throw new Error('Failed to fetch progress metrics');
      }
      console.log(response);
        const data = await response.json();
        setProgressMetrics(data);
        
    } catch (error) {
        console.error('Error fetching progress metrics:', error);
      setError(error.message);
      }
    setIsLoading(false);
      };
      fetchProgressMetrics(userData); // Make sure to pass userData if it's required
        }, []); // Include userData in the dependency array if it's needed to trigger the effect
        

  // const caloriesData = {
  //   labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  //   datasets: [{
  //     label: 'Calories Burnt',
  //     data: [2000, 2500, 2800, 3000], // Example static data
  //     fill: true,
  //     borderColor: '#742774',
  //     tension: 0.1
  //   }]
  // };

  const caloriesChartData = {
    labels: progressMetrics.map(metric => metric.date),
    datasets: [{
      label: 'Calories Burnt',
      data: progressMetrics.map(metric => parseFloat(metric.caloriesBurnt)),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      yAxisID: 'y-calories'
    }]
  };

  const options = {
    scales: {
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-calories',
        suggestedMin: 0,   // Set the minimum value of the y-axis
        suggestedMax: 1000, // Set the maximum value of the y-axis
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };  


  const goalData = {
    labels: ["Goal Progress"],
    datasets: [{
      label: 'Goal Achievement',
      data: [workoutPlan.goalProgress * 100],
      backgroundColor: ['#4BC0C0'],
    }]
  };

  const hydrationChart = {
    labels: ["Consumed", "Remaining"],
    datasets: [{
      label: 'Hydration (liters)',
      data: [2.5, 0.5], // Example: consumed 2.5L, goal 3L
      backgroundColor: ['#4BC0C0', '#C0C0C0'],
    }],
  };

  // Example for the sleep tracker (real data should be integrated)
  const sleepData = {
    labels: ["Recommended", "Actual"],
    datasets: [{
      label: 'Sleep Hours',
      data: [8, 6.5], // Example: 8 hours recommended, 6.5 hours actual
      backgroundColor: ['#FF6384', '#36A2EB'],
    }],
  };


  const mindfulnessSessions = [
  { date: '2024-04-18', type: 'Guided Meditation', duration: 30 },
  { date: '2024-04-16', type: 'Breathing Exercises', duration: 15 },
  { date: '2024-04-14', type: 'Body Scan Meditation', duration: 20 },
  { date: '2024-04-12', type: 'Loving Kindness Meditation', duration: 25 },
  { date: '2024-04-10', type: 'Progressive Relaxation', duration: 35 },
  ];

  const mindfulnessSummary = mindfulnessSessions.length ? mindfulnessSessions.map((session, index) => (
    <li key={index}>
      {session.date}: {session.type} - {session.duration} minutes
    </li>
  )) : <li>No mindfulness sessions recorded.</li>;

  // Meal Planner Detailed View
  const mealPlannerView = dailyMeals.length ? dailyMeals.map((meal, index) => (
    <div key={index} className="meal">
      <h4>{meal.time}: {meal.type}</h4>
      <p>Items: {meal.items.join(", ")}</p>
      <p>Calories: {meal.calories} kcal</p>
    </div>
  )) : <div>No meals planned.</div>;


  // Placeholder data for upcoming and recently watched videos

  // { id: 1, title: "Yoga Basics", url: "https://example.com/yoga-basics-video" },
  // { id: 2, title: "Advanced Cardio Workout", url: "https://example.com/advanced-cardio-video" },
  // Add more videos as needed


  const upcomingvideos= async(userData) => {
    setIsLoading(true);
    setError('');
    const jwtToken = userData.token;
    
  try{
    const response = await fetch(`https://cdnservice.azurewebsites.net/api/videos/trend`, { 
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

      setupcomingVideos(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching events. Contact admin.');
      setIsLoading(false);
    }
  };









const recentlyWatchedVideos = [
  { id: 1, title: "Strength Training 101", url: "https://example.com/strength-training-101-video", watchedOn: "2023-03-25" },
  { id: 2, title: "Morning Stretch Routine", url: "https://example.com/morning-stretch-video", watchedOn: "2023-03-24" },
  // Add more videos as needed
];

const trainingVideosRef = useRef();

const sessionsRef = useRef();

useImperativeHandle(ref, () => ({
  scrollToTrainingVideos: () => {
    trainingVideosRef.current?.scrollIntoView({ behavior: 'smooth' });
  },

  scrollToSessions: () => {
      sessionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}));







  return (
    <div ref={ref} className="client-progress-dashboard">
    {/* Progress Chart */}
    <div className="dashboard-row">
        <div className="dashboard-column">
        <div className="chart-container"> 
          <h3>Progress Overview</h3>
        <Bar data={progressData} /> 
        </div>
      </div>

      {/* Calories Chart */}
      <div className="dashboard-column">
        <div className="chart-container">
          <h3>Calories Burnt Over Time</h3>
          <Line data={caloriesChartData} options={options} />        </div>
      </div>
    </div>


      {/* Goal Tracking */}

    <div className="dashboard-row">
     <div className="dashboard-column">
      <div className="chart-container">
          <h3>Goal Achievement</h3>
          <Doughnut data={goalData} />
        </div>
    </div>
    
  

    {/* Hydration Tracker */}
    <div className="dashboard-column">
    <div className="chart-container">
        <h3>Hydration Tracker</h3>
        <Doughnut data={hydrationChart} />
      </div>
    </div>
    </div>



    {/* Sleep Tracker */}
  <div className="dashboard-row">
    <div className="dashboard-column">
      <div className="chart-container">
        <h3>Sleep Tracker</h3>
        <Bar data={sleepData} />
      </div>
    </div>
      

       {/* Upcoming Training Videos */}
    <div className="dashboard-column">  
       <div   className="video-section">
        <h3>Upcoming Training Videos</h3>
        <div className="videos-list">
          {upcomingVideos.map(video => (
            <div key={video.id} className="video-item">
              <a href={video.url} target="_blank" rel="noopener noreferrer">{video.title}</a>
            </div>
          ))}
        </div>
      </div>
     </div>
</div>

      {/* Mindfulness Sessions */}
        <div ref={sessionsRef} class="container">
          <div class="item">
            <h2>Mindfulness Sessions</h2>   
              <ul>{mindfulnessSummary}</ul>
            </div>
        `<div class="item">
            <h2>Meal Planner</h2>
              {mealPlannerView}
          </div>
        </div>

      {/* Workout Plan Details */}
      <div className="workout-details">
        <h3>Workout Routine</h3>
        {workoutPlan.details.map((detail, index) => (
          <div key={index} className="weekly-routine">
            <strong>Week {detail.week}: {detail.focus}</strong>
            <ul>
              {detail.sessions.map((session, sIndex) => (
                <li key={sIndex}>{session.day}: {session.exercises.join(", ")}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
     </div>
  
  );
});

export default ClientProgressDashboard;
