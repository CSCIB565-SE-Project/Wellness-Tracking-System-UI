import React, { useState, useEffect } from 'react';
import '../../styles/ProfessionalDashboard.css';
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
    const [videoTitle, setVideoTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [videos, setVideos] = useState([]);
    const [articles, setArticles] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [progressUpdates, setProgressUpdates] = useState([]);
    const [supplements, setSupplements] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    const [subscribedClients, setSubscribedClients] = useState([]);
    

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

  

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        const newVideo = {
            id: videos.length + 1,
            title: videoTitle,
            type: "New Session",
            url: videoUrl,
        };
        setVideos([...videos, { id: videos.length + 1, title: videoTitle, url: videoUrl }]);
        setVideoTitle('');
        setVideoUrl('');
        setIsLoading(false);
    }, 2000);
};


  return (
    <div className="professional-dashboard">
            <h2>Professional Content Management</h2>
            
            {/* Upload Video Section */}
            <form onSubmit={handleSubmit} className="upload-form">
                <h3>Upload New Video</h3>
                <input type="text" placeholder="Video Title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required />
                <input type="url" placeholder="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
                <button type="submit">{isLoading ? 'Uploading...' : 'Upload Video'}</button>
            </form>
            
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