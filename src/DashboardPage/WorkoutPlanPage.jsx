import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator';
import '../styles/VideoCard.css';
import { Link } from 'react-router-dom';
const { BlobServiceClient } = require("@azure/storage-blob");

const WorkoutPlanPage = () => {
    const { planId } = useParams();
    const { trainerId } = useParams();
    const [planDetails, setPlanDetails] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [userRole, setUserRole] = useState('user');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [videoType, setVideoType] = useState('');
    const [modeOfInstruction, setModeOfInstruction] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [showAddVideoForm, setShowAddVideoForm] = useState(false);
    const [editVideoId, setEditVideoId] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUserRole(userData.role.toLowerCase());
        console.log("user role is: ", setUserRole);
        if (planId) {
            fetchPlanDetails(planId, trainerId).catch(error => {
                console.error('Error fetching plan details:', error);
                setError('Failed to load plan details.');
            });
            fetchVideos(planId).catch(setError);
        }
        
    }, [planId]);

    // Function to get the details of the workout plan to display 
    // Would not work for users because there is no way to get their trainer id from the backend 
    // Seperate function if user??
    const fetchPlanDetails = async (planId, trainerId) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setIsLoading(true);
        setError('');
        const jwtToken = userData.token;
        
        
        try {
            const response = await fetch(`http://localhost:8000/api/workoutplan/fetch/${trainerId}`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch workout plans");
            }

            const data = await response.json();
            // Filter for the specific plan based on planId
            const specificPlan = data.find(plan => plan._id === planId);
            console.log('Specific Plan:', specificPlan);


            if (!specificPlan) {
                throw new Error("Workout plan not found");
            }

            setPlanDetails(specificPlan);
            setIsLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('An error occurred while fetching. Contact admin.');
            setIsLoading(false);
        }
    };
    
    //Fucntion for getting the videos that have been approved from backend
    const fetchVideos = async (planId) => {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;
    
        if (!jwtToken) {
            setError("You must be logged in to view videos. JWT expired");
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

    //To upload file 
    const handleFileChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    //Function to send video to backend for approval
    const handleVideoUpload  = async () => {
        if (!videoFile) {
            alert("Please select a video file before submitting.");
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
			const blobName = `${userData.userId}/${planId}/${videoFile.name}`;
			const blobClient = containerClient.getBlockBlobClient(blobName);
			const response = await blobClient.uploadData(await videoFile.arrayBuffer());
			console.log('Video uploaded successfully');
            let thumbnailImg = await generateVideoThumbnails(videoFile, 1);
            const thumbnailBlob = await base64ToBlob(thumbnailImg[0], 'image/jpeg');
            const thumbnailBlobName = `${userData.userId}/${planId}/${videoFile.name.split('.')[0]}.jpeg`;
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
                    title: videoTitle,
                    description: videoDescription,
                    imgUrl: thumbnailBlobName,
                    videoUrl: blobName,
                    modeOfInstruction: modeOfInstruction,
                    typeOfWorkout: videoType,
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
            setShowAddVideoForm(false);
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

    const navigateToDashboard = () => {
        if (userRole === 'professional') {
            navigate('/professionaldashboard');
        } else {
            navigate('/userdashboard');
        }
    };

    const updateVideoDetails = async () => {
        if (!editVideoId) return;

        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;

        try {
            const response = await fetch(`http://localhost:8000/api/videos/${editVideoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    title: videoTitle,
                    description: videoDescription,
                    type: videoType,
                    modeOfInstruction
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update video');
            }

            await fetchVideos(planId); 
            setEditVideoId(null); 
        } catch (error) {
            setError('An error occurred while updating the video. Contact admin.');
        }
    };


    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <button onClick={navigateToDashboard}>Back to Dashboard</button>
            {userRole === 'professional' && (
                <>
                    <button onClick={() => setShowAddVideoForm(!showAddVideoForm)}>
                        {showAddVideoForm ? 'Cancel' : 'Add Video'}
                    </button>
                    {showAddVideoForm && (
                        <div>
                            <label htmlFor="videoTitle">Video Title:</label>
                            <input
                                type="text"
                                id="videoTitle"
                                placeholder="Enter video title"
                                value={videoTitle}
                                onChange={e => setVideoTitle(e.target.value)}
                            />
    
                            <label htmlFor="videoDescription">Description:</label>
                            <textarea
                                id="videoDescription"
                                placeholder="Describe the video"
                                value={videoDescription}
                                onChange={e => setVideoDescription(e.target.value)}
                            />
    
                            <label htmlFor="videoType">Workout Type:</label>
                            <select
                                id="videoType"
                                value={videoType}
                                onChange={e => setVideoType(e.target.value)}
                            >
                                <option value="">Select Workout Type</option>
                                <option value="yoga">Yoga</option>
                                <option value="zumba">Zumba</option>
                                <option value="pilates">Pilates</option>
                                <option value="cardio">Cardio</option>
                                <option value="HIIT">HIIT</option>
                                <option value="strength">Strength Training</option>
                                <option value="stretching">Stretching</option>
                            </select>
    
                            <label htmlFor="modeOfInstruction">Mode of Instruction:</label>
                            <select
                                id="modeOfInstruction"
                                value={modeOfInstruction}
                                onChange={e => setModeOfInstruction(e.target.value)}
                            >
                                <option value="">Select Mode of Instruction</option>
                                <option value="Online">Online</option>
                                <option value="In Person">In Person</option>
                            </select>
    
                            <label htmlFor="videoFile">Upload Video:</label>
                            <input
                                type="file"
                                id="videoFile"
                                onChange={handleFileChange}
                                accept="video/*"
                            />
                            <button onClick={handleVideoUpload}>Submit Video</button>
                        </div>
                    )}
                    <button onClick={() => fetchVideos(planId)}>Refresh Video Approval</button>
                    <button onClick={() => setEditMode(!editMode)}>
                        {editMode ? 'Finish Editing' : 'Delete Videos'}
                    </button>
                    {editMode && (
                        <>
                            <button onClick={deleteSelectedVideos} disabled={selectedVideos.length === 0}>
                                Delete Selected Videos From Plan
                            </button>
                            {videos.map(video => (
                                <div key={video._id} className="video-edit-controls">
                                    <button onClick={() => {
                                        setEditVideoId(video._id);
                                        setVideoTitle(video.title);
                                        setVideoDescription(video.description);
                                        setVideoType(video.type);
                                        setModeOfInstruction(video.modeOfInstruction);
                                    }}>
                                        Edit Video
                                    </button>
                                </div>
                            ))}
                            {editVideoId && (
                                <div>
                                    <input type="text" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} />
                                    <textarea value={videoDescription} onChange={e => setVideoDescription(e.target.value)} />
                                    <select value={videoType} onChange={e => setVideoType(e.target.value)}>
                                        {/* Options for video types */}
                                    </select>
                                    <select value={modeOfInstruction} onChange={e => setModeOfInstruction(e.target.value)}>
                                        {/* Options for mode of instruction */}
                                    </select>
                                    <button onClick={updateVideoDetails}>Update Video Details</button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
            {planDetails ? (
                <>
                    <h2>{planDetails.title}</h2>
                    <p>Type: {planDetails.typeOfWorkout}</p>
                    <p>Description: {planDetails.description}</p>
                    <p>Created On: {new Date(planDetails.createdAt).toLocaleDateString()}</p>
                </>
            ) : (
                <p>Waiting for plan details...</p>
            )}
            <h3>Videos</h3>
            {videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map(video => (
                        <div key={video._id} className="video-card">
                            <Link to={`/videos/${video._id}`}>
                                <div className="thumbnail">
                                    {video.thumbnailUrl ? (
                                        <img src={video.thumbnailUrl} alt={video.title} />
                                    ) : (
                                        <div className="placeholder-thumbnail">
                                            <span>{video.title}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="video-info">
                                <h4>{video.title}</h4>
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
                <p></p>
            )}
        </div>
    );
    
    
};

export default WorkoutPlanPage;