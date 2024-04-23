import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WorkoutPlanVideoPage = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [videoDetails, setVideoDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch video details
    useEffect(() => {
        getVideo(videoId);
        getComments(videoId);
        getLikes(videoId);
    }, [videoId]);

    const getVideoUrl = async(videoId) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;
        if (!jwtToken) {
            setError("You must be logged in to view videos.");
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/api/videos/trainer/get/${videoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                    'id': userData.userId
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
    
            const video = await response.json();
            return video;
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
        }
    };

    const getVideo = async(videoId) => {
        console.log('Fetching video details for:', videoId);
        const video = await getVideoUrl(videoId);
        const videoUrl = video.videoUrl;
        setVideoDetails({
            src: `http://localhost:8000/api/videos/play?videoUrl=${videoUrl}`,
            title: video.title,
            id: video._id
        });
    };

    const getComments = async (videoId) => {
        console.log('Fetching comments for:', videoId);
        try {
            const response = await fetch(`http://localhost:8000/api/comments/${videoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
    
            const comments = await response.json();
            setComments(comments);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
        }
    };

    const getLikes = async (videoId) => {
        console.log('Fetching likes for:', videoId);
        const video = await getVideoUrl(videoId);
        const likes = video.likes;
        let likeCount = likes.length;
        setLikes(likeCount);
    };

    const updateLike = async (videoId) => {
        console.log('Updating likes for video:', videoId);
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;
        if (!jwtToken) {
            setError("You must be logged in to view videos.");
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/api/videos/like/${videoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                    'id': userData.userId
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
    
            const res = await response.json();
            getLikes(videoId);
        } catch (error) {
            console.error('Like error:', error);
            setError(error.message);
        }
    };

    const updateDislike = async (videoId) => {
        console.log('Updating dislikes for video:', videoId);
        const userData = JSON.parse(localStorage.getItem('user'));
        const jwtToken = userData ? userData.token : null;
        if (!jwtToken) {
            setError("You must be logged in to view videos.");
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/api/videos/unlike/${videoId}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                    'id': userData.userId
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to update dislikes');
            }
    
            const res = await response.json();
            getLikes(videoId);  
        } catch (error) {
            console.error('Dislike error:', error);
            setError(error.message);
        }
    };
    
    const getUserData = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        return userData;
    };

    const displayCommentSuccessMessage = () => {
        alert('Comment Added Successfully!');
    }

    const leaveComment = async (videoId, comment) => {
        // Placeholder for leaving a comment
        setIsLoading(true);
        setError('');
        const userData = getUserData();
        const jwtToken = userData.token;
        const text = comment;

        try{
            const response = await fetch('http://localhost:8000/api/comments', { 
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
                'id': userData.userId
                },
                body: JSON.stringify({ videoId, text }),
            });
            const data = await response.json();
            if (data) {
                console.log('Comment Added Successfully!', data);
                setIsLoading(false);
                setError('');
                displayCommentSuccessMessage();
                getComments(videoId);
            } 
        } catch {
            console.error('Comment error:', error);
            setError('An error occurred. Please try again later.');
        }   
    };

    return (
        <div>
            <button onClick={() => navigate(-1)}>Go Back to Plan</button>
            {videoDetails && (
                <>
                    <h1>{videoDetails.title}</h1>
                    <video controls src={videoDetails.src} width="100%">
                        Sorry, your browser does not support embedded videos.
                    </video>
                    <button onClick={() => updateLike(videoDetails.id)}>Like</button>
                    <p>Likes: {likes}</p>
                    <button onClick={() => updateDislike(videoDetails.id)}>Dislike</button>

                    <div>
                        <h2>Comments</h2>
                        <ul>
                            {comments.map(comment => (
                                <li key={comment._id}>{comment.text}</li>
                            ))}
                        </ul>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const comment = e.target.elements.comment.value;
                            leaveComment(videoDetails.id, comment);
                            e.target.reset();
                        }}>
                            <input name="comment" type="text" placeholder="Leave a comment" />
                            <button type="submit">Comment</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default WorkoutPlanVideoPage;