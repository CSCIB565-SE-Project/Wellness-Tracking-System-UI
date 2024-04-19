// import React, { useState, useRef } from 'react';

// const VideoUpload = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [videos, setVideos] = useState([]);
//   const fileInputRef = useRef(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [videoInfo, setVideoInfo] = useState({
//     trainerId: '',
//     title: '',
//     description: '',
//     modeOfInstruction: '',
//     typeOfWorkout: '',
//   });

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setIsDialogOpen(true);
//     }
//   };

//   const handleDialogSubmit = (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     setTimeout(() => {
//       const newVideo = {
//         id: videos.length + 1,
//         trainerId: videoInfo.trainerId,
//         title: videoInfo.title,
//         description: videoInfo.description,
//         modeOfInstruction: videoInfo.modeOfInstruction,
//         typeOfWorkout: videoInfo.typeOfWorkout,
//         url: "https://example.com/uploaded-video-url", // Ideally, this would be the result of the actual upload
//         dateOfUpload: new Date().toLocaleDateString(),
//         fileType: 'mp4', // This could be extracted from the file itself during upload
//       };
//       setVideos([...videos, newVideo]);
//       setIsLoading(false);
//       setIsDialogOpen(false);
//       setVideoInfo({
//         trainerId: '',
//         title: '',
//         description: '',
//         modeOfInstruction: '',
//         typeOfWorkout: '',
//       });
//     }, 2000);

// };

//   return (
//     <div>
//       <h2>Upload New Workout Video</h2>
//       <button onClick={() => fileInputRef.current.click()}>Select Video</button>
//       <input
//         ref={fileInputRef}
//         type="file"
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//         required
//       />

// {isDialogOpen && (
//   <div className="dialog-backdrop">
//     <div className="dialog">
//       <form onSubmit={handleDialogSubmit}>
//         <h3>Video Details</h3>
//         <label>
//           Trainer ID:
//           <input
//             type="text"
//             value={videoInfo.trainerId}
//             onChange={e => setVideoInfo({ ...videoInfo, trainerId: e.target.value })}
//             required
//           />
//         </label>
//         <label>
//           Title:
//           <input
//             type="text"
//             value={videoInfo.title}
//             onChange={e => setVideoInfo({ ...videoInfo, title: e.target.value })}
//             required
//           />
//         </label>
 
//         <label>
//       Mode of Instruction:
//       <select
//         value={videoInfo.modeOfInstruction}
//         onChange={e => setVideoInfo({ ...videoInfo, modeOfInstruction: e.target.value })}
//         required>
//         <option value="">Select Mode of Instruction</option>
//         <option value="At Home">At Home</option>
//         <option value="At Gym">At Gym</option>
//       </select>
//     </label>


//         <label>
//       Type of Workout:
//       <select
//         value={videoInfo.typeOfWorkout}
//         onChange={e => setVideoInfo({ ...videoInfo, typeOfWorkout: e.target.value })}
//         required>
//         <option value="">Select Type of Workout</option>
//         <option value="Yoga">Yoga</option>
//         <option value="Zumba">Zumba</option>
//         <option value="Pilates">Pilates</option>
//         <option value="Cardio">Cardio</option>
//         <option value="Strength Training">Strength Training</option>
//         <option value="HIIT">HIIT</option>
//         <option value="Stretching">Stretching</option>
//       </select>
//     </label>


//         <div className="dialog-actions">
//           <button type="button" onClick={() => setIsDialogOpen(false)}>Cancel</button>
//           <button type="submit">Upload</button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}


// <div className="uploaded-videos-section">
//   <h3>Uploaded Videos</h3>
//   <table>
//     <thead>
//       <tr>
//         <th>Title</th>
//         <th>Trainer ID</th>
//         <th>Date of Upload</th>
//         <th>Mode of Instruction</th>
//         <th>Type of Workout</th>
//         <th>File Type</th>
//         <th>URL</th>
//       </tr>
//     </thead>
//     <tbody>
//       {videos.map(video => (
//         <tr key={video.id}>
//           <td>{video.title}</td>
//           <td>{video.trainerId}</td>
//           <td>{video.dateOfUpload}</td>
//           <td>{video.modeOfInstruction}</td>
//           <td>{video.typeOfWorkout}</td>
//           <td>{video.fileType.toUpperCase()}</td>
//           <td><a href={video.url} target="_blank" rel="noopener noreferrer">Watch Video</a></td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>
 
// </div>


// )
// };

// export default VideoUpload;