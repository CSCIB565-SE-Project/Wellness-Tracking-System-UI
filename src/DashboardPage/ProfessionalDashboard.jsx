// import React, { useState, useEffect, useRef } from 'react'; // Add useRef
// import '../styles/ProfessionalDashboard.css';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import format from 'date-fns/format';

// import parseISO from 'date-fns/parseISO';
// import startOfWeek from 'date-fns/startOfWeek';
// import getDay from 'date-fns/getDay';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { addHours } from 'date-fns';

// // Make sure these imports match your project structure
// import enUS from 'date-fns/locale/en-US';

// const locales = {
//   'en-US': enUS,
// };


// const localizer = dateFnsLocalizer({
//     format,
//     parse: parseISO,
//     startOfWeek,
//     getDay,
//     locales,
//   });
  
// const ProfessionalDashboard = () => {
//     // States for video uploads
//     const [videoTitle, setVideoTitle] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [videos, setVideos] = useState([]);
//     const [articles, setArticles] = useState([]);
//     const [appointments, setAppointments] = useState([]);
//     const [progressUpdates, setProgressUpdates] = useState([]);
//     const [supplements, setSupplements] = useState([]);
//     const [liveSessions, setLiveSessions] = useState([]);
//     const [subscribedClients, setSubscribedClients] = useState([]);
    
//     const fileInputRef = useRef(null);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [videoInfo, setVideoInfo] = useState({
//   trainerId: '',
//   title: '',
//   description: '',
//   modeOfInstruction: '',
//   typeOfWorkout: '',
// });

//   useEffect(() => {
//     // Mock fetch existing videos, articles, appointments, progress reports, and supplements
    
//     setVideos([
//         { id: 1, title: "30-Minute Cardio Session", url: "https://example.com/cardio-session" },
//         { id: 2, title: "Yoga for Flexibility", url: "https://example.com/yoga-flexibility" },
//     ]);

//     const mockVideos = [
//       { id: 1, title: "Yoga for Beginners", type: "Yoga", url: "https://example.com/yoga-beginners" },
//       { id: 2, title: "10 Minute Zumba", type: "Zumba", url: "https://example.com/10-min-zumba" },
//     ];

//     setVideos(mockVideos);

//     const mockArticles = [
//       { id: 1, title: "Benefits of Yoga", content: "Yoga improves flexibility, strength, and mental well-being." },
//       { id: 2, title: "Why Cardio is Vital", content: "Cardiovascular exercise increases heart health and stamina." },
//     ];

//     setArticles(mockArticles);

//     const mockAppointments = [
//         { id: 1, date: "2023-10-01", time: "10:00", client: "John Doe", sessionType: "Personal Training" },
//         { id: 2, date: "2023-10-03", time: "12:00", client: "Jane Smith", sessionType: "Yoga" },
//       ];
    
//       const convertedAppointments = mockAppointments.map(appointment => {
//         const startTime = parseISO(`${appointment.date}T${appointment.time}`);
//         const endTime = addHours(startTime, 1); // Correctly adding 1 hour
//         return { ...appointment, start: startTime, end: endTime };
//       });
    
//       setAppointments(convertedAppointments);
   

//     const mockLiveSessions = [{ id: 1, title: "Live Yoga Session", date: new Date() }];
    
//     setLiveSessions(mockLiveSessions);


//     const mockProgressReports = [
//       { id: 1, client: "John Doe", progress: "Improved 5k run time by 2 minutes." },
//       { id: 2, client: "Jane Smith", progress: "Increased flexibility in yoga poses." },
//     ];

//     setProgressUpdates(mockProgressReports);


//     const mockSupplementRecommendations = [
//       { id: 1, name: "Whey Protein", benefits: "Helps muscle recovery and growth." },
//       { id: 2, name: "Vitamin D", benefits: "Supports bone health and immune function." },
//     ];


//     setSupplements(mockSupplementRecommendations);


//     const mockSubscribedClients = [
//         { id: 1, name: "Prinston Rebello", subscriptionDate: "2023-01-15" },
//         { id: 2, name: "Jane Doe", subscriptionDate: "2023-02-01" },
//         { id: 3, name: "John Doe", subscriptionDate: "2023-02-15" },
//         // Add more subscribed clients as needed
//       ];
  
//       setSubscribedClients(mockSubscribedClients);

//   }, []);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       console.log("Selected file:", file.name);
//       setIsDialogOpen(true); // Open dialog upon file selection
//     }
//   };

  
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     console.log("Uploading video with info:", videoInfo);
//     // Assume here that the video URL is already set by the file selection
//     setTimeout(() => {
//       const newVideo = {
//         id: videos.length + 1,
//         title: videoInfo.title, // Using title from dialog
//         type: "New Session",
//         url: "https://example.com/uploaded-video-url" // Placeholder URL, replace with actual upload logic
//       };
//       setVideos([...videos, newVideo]);
//       setIsLoading(false);
//       setIsDialogOpen(false); // Close dialog after submission
//       setVideoInfo({
//         trainerId: '',
//         title: '',
//         description: '',
//         modeOfInstruction: '',
//         typeOfWorkout: '',
//       });
//     }, 2000);
//   };

//   const handleDialogSubmit = (e) => {
//     e.preventDefault();
//     handleSubmit(e);
//   };


//   return (
//     <div className="professional-dashboard">
//     <h2>Professional Content Management</h2>
//     <button onClick={() => fileInputRef.current.click()}>
//       Select Video
//     </button>
//     <input
//       ref={fileInputRef}
//       type="file"
//       style={{ display: "none" }}
//       onChange={handleFileChange}
//       required
//     />
//     {isDialogOpen && (
//         <div className="dialog-backdrop">
//           <div className="dialog">
//             <form onSubmit={handleDialogSubmit}>
//               {/* Dialog content for video info */}
//               {/* Inputs for trainerId, title, description, modeOfInstruction, typeOfWorkout */}
//               {/* Submit button */}
//             </form>
//           </div>
//         </div>
//       )}
//         <h2>Video Details</h2>
//         <input
//           type="text"
//           value={videoInfo.trainerId}
//           onChange={e => setVideoInfo({ ...videoInfo, trainerId: e.target.value })}
//           placeholder="Trainer ID"
//           required
//         />
//         <input
//           type="text"
//           value={videoInfo.title}
//           placeholder="Title"
//           required
//         />
//         <textarea
//           value={videoInfo.description}
//           onChange={e => setVideoInfo({ ...videoInfo, description: e.target.value })}
//           placeholder="Description"
//           required
//         />
//         <input
//           type="text"
//           value={videoInfo.modeOfInstruction}
//           onChange={e => setVideoInfo({ ...videoInfo, modeOfInstruction: e.target.value })}
//           placeholder="Mode of Instruction"
//           required
//         />
//         <input
//           type="text"
//           value={videoInfo.typeOfWorkout}
//           onChange={e => setVideoInfo({ ...videoInfo, typeOfWorkout: e.target.value })}
//           placeholder="Type of Workout"
//           required
//         />
//         <div className="dialog-actions">
//           <button type="button" onClick={() => setIsDialogOpen(false)}>Cancel</button>
//           <button type="submit">Upload</button>
//         </div>
  
//             {/* Upload Video Section */}
//             <form onSubmit={handleSubmit} className="upload-form">
//               <h3>Upload New Video</h3>
//           <input
//           type="text"
//           placeholder="Video Title"
//           value={videoTitle}
//           onChange={(e) => setVideoTitle(e.target.value)}
//           required
//         />

//         <input
//           ref={fileInputRef}
//           type="file"
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//           required
//         />
//         <button type="button" onClick={() => fileInputRef.current.click()}>
//   Select Video
// </button>
// <button type="submit" disabled={isLoading || !videoTitle}>
//   {isLoading ? 'Preparing Upload...' : 'Next'}
// </button>
     



//         {/* Example showing uploaded videos */}
//       <div className="section">
//         <h3>Uploaded Videos</h3>
//         {videos.map(video => (
//           <div key={video.id} className="content-item">
//             <h4>{video.title}</h4>
//             <p>Type: {video.type}</p>
//             <p>URL: {video.url}</p>
//           </div>
//         ))}
//       </div>
            
//             {/* Articles Section */}
//             <div className="section">
//                 <h3>Articles</h3>
//                 {articles.map(article => (
//                     <div key={article.id} className="content-item">
//                         <h4>{article.title}</h4>
//                         <p>{article.content}</p>
//                     </div>
//                 ))}
//             </div>
            
//             {/* Appointments Calendar */}
//             <div className="section">
//                 <h3>Appointments</h3>
            
//                 <Calendar
//                     localizer={localizer}
//                     events={appointments}
//                     startAccessor="start"
//                     endAccessor="end"
//                     style={{ height: 500 }}
//                 />
//             </div>
            

//             {/* Live Sessions */}
//             {/* Live Sessions */}
// <div className="section">
//   <h3>Live Sessions</h3>
//   {liveSessions.map(session => (
//     <div key={session.id} className="content-item">
//       <h4>{session.title}</h4>
//       {/* Ensure the date is converted to string */}
//       <p>Date: {format(session.date, 'PPP', { locale: enUS })}</p>
//     </div>
//   ))}
// </div>
            
//             {/* Progress Updates */}
//             <div className="section">
//                 <h3>Client Progress Updates</h3>
//                 {progressUpdates.map(update => (
//                     <div key={update.id} className="content-item">
//                         <h4>{update.clientName}</h4>
//                         <p>{update.update}</p>
//                     </div>
//                 ))}
//             </div>
            
//             {/* Supplements Recommendations */}
//             <div className="section">
//                 <h3>Supplement Recommendations</h3>
//                 {supplements.map(supplement => (
//                     <div key={supplement.id} className="content-item">
//                         <h4>{supplement.name}</h4>
//                         <p>{supplement.benefit}</p>
//                     </div>
//                 ))}
//             </div>

//             <div className="section">
//             <h3>Subscribed Clients</h3>
//             <ul>
//   {subscribedClients.map(client => (
//     <li key={client.id}>
//       {client.name} (Subscribed on: {format(parseISO(client.subscriptionDate), 'PPP', { locale: enUS })})
//     </li>
//   ))}
// </ul>
//             </div>
//         </div>
//     );
// } ;

// export default ProfessionalDashboard;

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

const ProfessionalDashboard = () => {
HEAD
 
  const headerRef = useRef(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
    const navigate = useNavigate();
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
    
// >>>>>>> 573ec8b7e9b1cee3a15c653b76823755307e9891

  // const [articles, setArticles] = useState([]);
  // const [appointments, setAppointments] = useState([]);
  // const [progressUpdates, setProgressUpdates] = useState([]);
  // const [supplements, setSupplements] = useState([]);
  // const [liveSessions, setLiveSessions] = useState([]);
  // const [subscribedClients, setSubscribedClients] = useState([]);
  
 
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

          const handleScroll = () => {
          if (headerRef.current) { // Check if the ref is attached
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
              headerRef.current.classList.add('sticky__header');
            } else {
              headerRef.current.classList.remove('sticky__header');
            }
          }
        };
      
          window.addEventListener('scroll', handleScroll);
          
          // Clean up function
          return () => window.removeEventListener('scroll', handleScroll);
    


      const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

      const onNavigate = (path) => {
        navigate(path);
      };


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
    <>
   <div className="header">
      <img src="../assests/img/logo.png" alt="Company Logo" className="company-logo" onClick={() => onNavigate('/')} />
      <nav className="navigation">
        {nav__links.map(link => (
          <li key={link.display} onClick={() => onNavigate(link.path)}>{link.display}</li>
        ))}
      </nav>
      <div className="profile-section">
        <div className="profile-icon" onClick={toggleProfileDropdown}>
          
        </div>
        <div className="hello-msg">
          Hello, User
        </div>
        {isProfileDropdownOpen && (
          <div className="profile-dropdown">
            <a href="/change-profile">Change Profile</a> {/* Adjust link as necessary */}
            <button onClick={() => onNavigate('/logout')}>Logout</button> {/* Implement logout logic */}
          </div>
        )}
      </div>
    

    <div className="professional-dashboard">
      <h2>User Content Management</h2>
      
      <button onClick={() => navigate('/video-upload')}>Create Workout Plan</button>
  
        {/* Articles */}
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
          <section id = 'appointments'>
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
            </section>
          
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

             <section id ="client-metrics">
             <div className="section">
                 <h3>Client Progress Updates</h3>
                {progressUpdates.map(update => (
                    <div key={update.id} className="content-item">
                        <h4>{update.clientName}</h4>
                        <p>{update.update}</p>
                    </div>
                ))}
            </div>
            </section>

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


            {/* Subscribed Client */}
            <section name ="clients">
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
              </section>
            </div>
        </div>
  </>
  );
                  
};

export default ProfessionalDashboard;