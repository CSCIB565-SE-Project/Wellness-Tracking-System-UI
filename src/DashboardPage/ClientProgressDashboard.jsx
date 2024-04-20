// import React from 'react';
// import '../../styles/ClientProgressDashboard.css'; // Make sure to create corresponding CSS file

// const ClientProgressDashboard = ({ workoutPlan, progressMetrics }) => {
//     return (
//         <div className="client-progress-dashboard">
//             <h2>Your Fitness Progress</h2>

//             <div className="workout-plan">
//                 <h3>Enrolled Workout Routine</h3>
//                 <p>{workoutPlan.description}</p>
//             </div>

//             <div className="progress-metrics">
//                 <h3>Progress Metrics</h3>
//                 <ul>
//                     {progressMetrics.map(metric => (
//                         <li key={metric.id}>
//                             <span className="metric-name">{metric.name}:</span>
//                             <span className="metric-value">{metric.value}</span>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <div className="calories-burnt">
//                 <h3>Calories Burnt</h3>
//                 <p>{workoutPlan.caloriesBurnt} calories</p>
//             </div>

//             <div className="goal-tracking">
//                 <h3>Goal Tracking</h3>
//                 <p>{Math.round(workoutPlan.goalProgress * 100)}% to goal</p>
//                 <div className="progress-bar-container">
//                     <div className="progress-bar" style={{ width: `${workoutPlan.goalProgress * 100}%` }}></div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ClientProgressDashboard;
// ClientProgressDashboard.jsx

import React from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/ClientProgressDashboard.css'; 

const ClientProgressDashboard = ({ workoutPlan, mindfulnessSessions = [], dailyMeals = [],  yourPlans }) => {
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

  const caloriesData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: 'Calories Burnt',
      data: [2000, 2500, 2800, 3000], // Example static data
      fill: true,
      borderColor: '#742774',
      tension: 0.1
    }]
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
const upcomingVideos = [
  { id: 1, title: "Yoga Basics", url: "https://example.com/yoga-basics-video" },
  { id: 2, title: "Advanced Cardio Workout", url: "https://example.com/advanced-cardio-video" },
  // Add more videos as needed
];

const recentlyWatchedVideos = [
  { id: 1, title: "Strength Training 101", url: "https://example.com/strength-training-101-video", watchedOn: "2023-03-25" },
  { id: 2, title: "Morning Stretch Routine", url: "https://example.com/morning-stretch-video", watchedOn: "2023-03-24" },
  // Add more videos as needed
];

  return (
    <div className="client-progress-dashboard">
      <h2>Health & Fitness Dashboard</h2>

      {/* Progress Chart */}
      <div className="chart-container">
        <h3>Progress Overview</h3>
        <Bar data={progressData} />
      </div>

      {/* Calories Chart */}
      <div className="chart-container">
        <h3>Calories Burnt Over Time</h3>
        <Line data={caloriesData} />
      </div>

      {/* Goal Tracking */}
      <div className="chart-container">
        <h3>Goal Achievement</h3>
        <Doughnut data={goalData} />
      </div>

    {/* Hydration Tracker */}
    <div className="chart-container">
        <h3>Hydration Tracker</h3>
        <Doughnut data={hydrationChart} />
      </div>

      {/* Sleep Tracker */}
      <div className="chart-container">
        <h3>Sleep Tracker</h3>
        <Bar data={sleepData} />
      </div>
      
      {/* Mindfulness Sessions */}
      <div className="section">
        <h3>Mindfulness Sessions</h3>
        <ul>{mindfulnessSummary}</ul>
      </div>

      {/* Meal Planner */}
      <div className="section">
        <h3>Meal Planner</h3>
        {mealPlannerView}
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


      {/* Upcoming Training Videos */}
      <div className="video-section">
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
  );
};

export default ClientProgressDashboard;
