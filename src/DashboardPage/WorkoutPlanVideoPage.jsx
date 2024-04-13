import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WorkoutPlanVideoPage = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [videoDetails, setVideoDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);

    // Fetch video details
    useEffect(() => {
        getVideo(videoId);
        getComments(videoId);
        getLikes(videoId);
    }, [videoId]);

    const getVideo = async (videoId) => {
        // Fetching video details
        console.log('Fetching video details for:', videoId);
        // AAPI call
        setVideoDetails({
            src: "http://example.com/video.mp4",
            title: "Workout Video"
        });
    };

    const getComments = async (videoId) => {
        // Placeholder for fetching comments
        console.log('Fetching comments for:', videoId);
        // Simulate API call
        setComments([{ id: 1, text: "Great workout!" }]);
    };

    const getLikes = async (videoId) => {
        // Placeholder for fetching likes
        console.log('Fetching likes for:', videoId);
        // Simulate API call
        setLikes(200);
    };

    const updateLike = async () => {
        // Placeholder for updating likes
        console.log('Updating likes for video:', videoId);
        setLikes(likes + 1);  // Example increment
    };

    const leaveComment = async (comment) => {
        // Placeholder for leaving a comment
        console.log('Leaving comment:', comment);
        setComments([...comments, { id: comments.length + 1, text: comment }]);
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
                    <button onClick={updateLike}>Like</button>
                    <p>Likes: {likes}</p>
                    <div>
                        <h2>Comments</h2>
                        <ul>
                            {comments.map(comment => (
                                <li key={comment.id}>{comment.text}</li>
                            ))}
                        </ul>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const comment = e.target.elements.comment.value;
                            leaveComment(comment);
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
