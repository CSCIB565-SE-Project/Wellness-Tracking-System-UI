import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator';
import '../styles/VideoCard.css';
const { BlobServiceClient } = require("@azure/storage-blob");

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
            const response = await fetch(`http://localhost:8000/api/workoutplan/view/${planId}`, {
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
            const response = await fetch(`http://localhost:8000/api/videos/get/${planId}`, {
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
            const videosWithThumbnails = await fetchThumbnailsForVideos(videos);
            setVideos(videosWithThumbnails); 
            setIsLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    const fetchThumbnailsForVideos = async (videos) => {
        const AZ_SA_CONN_STR="BlobEndpoint=https://wellnesstrackingsa.blob.core.windows.net/;QueueEndpoint=https://wellnesstrackingsa.queue.core.windows.net/;FileEndpoint=https://wellnesstrackingsa.file.core.windows.net/;TableEndpoint=https://wellnesstrackingsa.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-06-01T03:07:21Z&st=2024-03-26T19:07:21Z&spr=https,http&sig=wrxJCD5%2FjyCpm%2BtZ3dJcl%2Bk%2FumwIkwNtV9SzbCO4%2B7A%3D";
        const connStr = AZ_SA_CONN_STR;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        const containerClient = blobServiceClient.getContainerClient('wellness-tracking-container');

        const videosWithThumbnails = [];

        for (const video of videos) {
            const thumbnailBlobName = video.imgUrl;
            const thumbnailBlobClient = containerClient.getBlobClient(thumbnailBlobName);
    
            try {
                const thumbnailUrl = thumbnailBlobClient.url;
                videosWithThumbnails.push({ ...video, thumbnailUrl });
            } catch (error) {
                console.error('Error fetching thumbnail:', error);
                videosWithThumbnails.push({ ...video, thumbnailUrl: null });
            }
        }
    
        return videosWithThumbnails;
    };

    async function base64ToBlob(base64String, mimeType) {
        const response = await fetch(base64String);
        const blob = await response.blob();
        return blob;
    }

    //Function to send video to backend for approval
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;

        try {
            const AZ_SA_CONN_STR="BlobEndpoint=https://wellnesstrackingsa.blob.core.windows.net/;QueueEndpoint=https://wellnesstrackingsa.queue.core.windows.net/;FileEndpoint=https://wellnesstrackingsa.file.core.windows.net/;TableEndpoint=https://wellnesstrackingsa.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-06-01T03:07:21Z&st=2024-03-26T19:07:21Z&spr=https,http&sig=wrxJCD5%2FjyCpm%2BtZ3dJcl%2Bk%2FumwIkwNtV9SzbCO4%2B7A%3D";
            const connStr = AZ_SA_CONN_STR;
			const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
			const containerClient = blobServiceClient.getContainerClient('wellness-tracking-container');
			const blobName = `${userData.userId}/${planId}/${file.name}`;
			const blobClient = containerClient.getBlockBlobClient(blobName);
			await blobClient.uploadData(await file.arrayBuffer());
			console.log('Video uploaded successfully');
            let thumbnailImg = await generateVideoThumbnails(file, 1);
            const thumbnailBlob = await base64ToBlob(thumbnailImg[0], 'image/jpeg');
            const thumbnailBlobName = `${userData.userId}/${planId}/${file.name.split('.')[0]}.jpeg`;
            const thumbnailBlobClient = containerClient.getBlockBlobClient(thumbnailBlobName);
            await thumbnailBlobClient.uploadData(thumbnailBlob, thumbnailBlob.length);

            const res = await fetch(`http://localhost:8000/api/videos/add/${planId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trainerId: userData.userId,
                    workOutPlanId: planId,
                    title: file.name,
                    description: "Video Description",
                    imgUrl: thumbnailBlobName,
                    videoUrl: blobName,
                    modeOfInstruction: "Online",
                    typeOfWorkout: "HIT",
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to upload video');
            }

            const result = await res.json();
            console.log('Upload successful', result);
            fetchVideos(planId);
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
            <p>Type: {planDetails?.typeOfWorkout}</p>
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
                {videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map(video => (
                            <div key={video._id} className="video-card">
                                <div key={video._id} className="video-card">
                                    <div className="thumbnail">
                                        {video.thumbnailUrl ? (
                                            <img src={video.thumbnailUrl} alt={video.title} />
                                        ) : (
                                            <div className="placeholder-thumbnail">
                                                <span>{video.title}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="video-info">
                                    <h4>{video.title}</h4>
                                    {/* Additional video details if needed */}
                                    <p>Description: {video.description}</p>
                                </div>
                                {editMode && (
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={selectedVideos.includes(video._id)}
                                            onChange={() => toggleVideoSelection(video._id)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No videos found for this plan.</p>
                )}
        </div>
    );
};

export default WorkoutPlanPage;
