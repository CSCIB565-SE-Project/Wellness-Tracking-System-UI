import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WorkoutPlanPage = () => {
    const { planId } = useParams();
    const [planDetails, setPlanDetails] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (planId) {
            fetchPlanDetails(planId).catch(error => {
                console.error('Error fetching plan details:', error);
                setError('Failed to load plan details.');
            });
        }
        fetchVideos(planId).catch(setError);
    }, [planId]);

    // Function to get the details of the workout plan to display 
    const fetchPlanDetails = async (planId) => {
        setIsLoading(true); 
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;

        if (!jwtToken) {
            setError("You must be logged in to view this.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/workoutplan/fetch/${userData.userId}/${planId}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch workout plan details');
            }

            const data = await response.json();
            setPlanDetails(data);//json with title, type description, createdAt
            setIsLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };
    
    //Fucntion for getting the videos that have been approved from backend
    const fetchVideos = async (planId) => {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;
    
        if (!jwtToken) {
            setError("You must be logged in to view videos.");
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/api/videos/fetch/${userData.userId}/${planId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
    
            const videos = await response.json();
            setVideos(videos);// Array of video objects with info like title
            setIsLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    //Function to send video to backend for approval
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;
        const formData = new FormData();
        formData.append("video", file); // Adjust "video" based on API requirement

        try {
            const response = await fetch(`http://localhost:8000/api/videos/upload/${userData.userId}/${planId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload video');
            }

            const result = await response.json();
            console.log('Upload successful', result);
            fetchVideos(planId); // Refresh videos after upload
        } catch (error) {
            console.error('Upload error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVideoSelection = (videoId) => {
        setSelectedVideos(prev => {
            if (prev.includes(videoId)) {
                return prev.filter(id => id !== videoId);
            } else {
                return [...prev, videoId];
            }
        });
    };

    // Function to call backend for deleting selected videos
    const deleteSelectedVideos = async () => {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;

        try {
            // Assuming backend can handle an array of video IDs for deletion
            const response = await fetch(`http://localhost:8000/api/videos/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ videoIds: selectedVideos }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete videos');
            }

            // Refresh the videos list after deletion
            fetchVideos(planId);
            setSelectedVideos([]); // Clear selection after deletion
            setEditMode(false); // Exit edit mode
        } catch (error) {
            console.error('Delete error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <button onClick={() => navigate('/professionaldashboard')}>Back to Dashboard</button>
            <button onClick={() => fetchVideos(planId)}>Refresh Video Approval</button>
            <h2>{planDetails?.title}</h2>
            <p>Type: {planDetails?.type}</p>
            <p>Description: {planDetails?.description}</p>
            <p>Created On: {planDetails?.createdAt}</p>
            
            <input type="file" onChange={handleFileUpload} accept="video/*" />
            <button onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Finish Editing' : 'Edit Videos'}
            </button>
            {editMode && (
                <button onClick={deleteSelectedVideos} disabled={selectedVideos.length === 0}>
                    Delete Selected Videos From Plan
                </button>
            )}
            <h3>Videos</h3>
            {videos.length > 0 ? videos.map(video => (
                <div key={video.id}>
                    {editMode && (
                        <input
                            type="checkbox"
                            checked={selectedVideos.includes(video.id)}
                            onChange={() => toggleVideoSelection(video.id)}
                        />
                    )}
                    <p>{video.title}</p>
                    {/* Additional video details if needed */}
                </div>
            )) : <p>No videos found for this plan.</p>}
        </div>
    );
};

export default WorkoutPlanPage;
