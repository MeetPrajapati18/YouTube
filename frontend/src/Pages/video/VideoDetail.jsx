import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaThumbsUp, FaArrowLeft } from "react-icons/fa"; // Icons

function VideoDetail() {
  const { id } = useParams(); // Extract video ID
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const videoResponse = await axios.get(`/api/v1/videos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const commentResponse = await axios.get(`/api/v1/comments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const likeStatusResponse = await axios.get(`/api/v1/likes/videos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVideo(videoResponse.data.data);
        setComments(commentResponse.data.data || []);
        setLiked(likeStatusResponse.data.isLiked);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load video details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/v1/likes/toggle/v/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLiked(!liked);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/v1/comments/${id}`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [response.data.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleCommentLikeClick = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/v1/likes/toggle/c/${commentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the specific comment's `isLiked` status
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, isLiked: !comment.isLiked }
            : comment
        )
      );
    } catch (err) {
      console.error("Error toggling comment like:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Back Button for Mobile */}
      <div className="bg-gray-800 sticky top-0 z-10 flex items-center px-4 py-2 sm:hidden">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-xl hover:text-purple-300"
        >
          <FaArrowLeft />
        </button>
        <h1 className="ml-4 text-lg font-semibold">{video.title}</h1>
      </div>

      <div className="container mx-auto p-4">
        {/* Video Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <video controls className="w-full rounded-lg">
                <source src={video.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="mb-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <p className="text-gray-300 mt-2">{video.description}</p>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Link to={`/channel/${video.owner?._id}`} className="flex items-center">
                <img
                  src={video.owner.avatar || "https://via.placeholder.com/150"}
                  alt="Channel Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <span className="ml-3 font-semibold">{video.owner.username}</span>
              </Link>
              <button
                onClick={handleLikeClick}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  liked ? "bg-blue-600" : "bg-gray-700"
                } hover:bg-blue-700`}
              >
                <FaThumbsUp />
                <span>{liked ? "Liked" : "Like"}</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Comments</h2>

            {/* Add Comment */}
            <div className="mb-4">
              <textarea
                className="w-full p-3 bg-gray-800 rounded-lg text-white"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <button
                onClick={handleCommentSubmit}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Post Comment
              </button>
            </div>

            {/* Comment List */}
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-800 rounded-lg p-4 mb-2">
                <p className="text-gray-300">
                  <span className="font-bold text-white">{comment.owner.username}</span>: {comment.content}
                </p>
                <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                <button
                  onClick={() => handleCommentLikeClick(comment._id)}
                  className={`flex items-center space-x-2 mt-2 ${
                    comment.isLiked ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <FaThumbsUp />
                  <span>{comment.isLiked ? "Liked" : "Like"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoDetail;

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Like icons

// function VideoDetail() {
//     const { id } = useParams(); // Extract video id from the route
//     const [video, setVideo] = useState(null);
//     const [comments, setComments] = useState([]);
//     const [commentText, setCommentText] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [liked, setLiked] = useState(false); // Add state for video like status

//     useEffect(() => {
//         const fetchVideoDetails = async () => {
//             try {
//                 const token = localStorage.getItem("token");

//                 // Fetch video details
//                 const videoResponse = await axios.get(`/api/v1/videos/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log("Video fetched:", videoResponse.data);

//                 // Fetch comments for the video
//                 const commentResponse = await axios.get(`/api/v1/comments/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log("Comments fetched:", commentResponse.data);

//                 // Set video and comments data to state
//                 setVideo(videoResponse.data.data);
//                 setComments(commentResponse.data.data || []);  // Ensure comments is always an array

//                 // Check if the video is liked by the user
//                 const likeStatusResponse = await axios.get(`/api/v1/likes/videos/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setLiked(likeStatusResponse.data.isLiked);  // Assuming the backend returns if the video is liked
//             } catch (err) {
//                 console.error("Error fetching video details or comments:", err);
//                 setError("Failed to fetch video details or comments. Please check the console for details.");
//             } finally {
//                 setLoading(false);  // Set loading to false once both video and comments are fetched
//             }
//         };

//         fetchVideoDetails();
//     }, [id]);

//     // Handle comment submission
//     const handleCommentSubmit = async () => {
//         if (!commentText.trim()) {
//             alert("Comment cannot be empty!");
//             return;
//         }

//         try {
//             const token = localStorage.getItem("token");

//             console.log("Submitting comment:", commentText);
//             const response = await axios.post(
//                 `/api/v1/comments/${id}`,
//                 { content: commentText },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             console.log("Comment added successfully:", response.data);
//             setComments((prev) => [response.data.data, ...prev]);
//             setCommentText("");
//         } catch (err) {
//             console.error("Error adding comment:", err);
//             alert("Failed to add comment. Please check the console for details.");
//         }
//     };

//     // Handle like/unlike action for the video
//     const handleLikeClick = async () => {
//         try {
//             const token = localStorage.getItem("token");

//             // Toggle like status
//             const response = await axios.post(
//                 `/api/v1/likes/toggle/v/${id}`,
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             console.log("Like toggled:", response.data);
//             setLiked(!liked); // Toggle the liked state
//         } catch (err) {
//             console.error("Error toggling like status:", err);
//             alert("Failed to toggle like status. Please check the console for details.");
//         }
//     };

//     // Handle like/unlike action for a comment
//     const handleCommentLikeClick = async (commentId) => {
//         try {
//             const token = localStorage.getItem("token");

//             // Toggle like status for the comment
//             const response = await axios.post(
//                 `/api/v1/likes/toggle/c/${commentId}`,
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             console.log("Comment like toggled:", response.data);
//             // Update the comments state to reflect the like status
//             setComments((prevComments) =>
//                 prevComments.map((comment) =>
//                     comment._id === commentId
//                         ? { ...comment, isLiked: !comment.isLiked }
//                         : comment
//                 )
//             );
//         } catch (err) {
//             console.error("Error toggling comment like status:", err);
//             alert("Failed to toggle comment like status. Please check the console for details.");
//         }
//     };

//     if (loading) {
//         return <div className="text-gray-400">Loading video details...</div>;
//     }

//     if (error) {
//         return <div className="text-red-500">{error}</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-6">
//             <div className="container mx-auto">
//                 {/* Video Details Section */}
//                 <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
//                     <div className="aspect-w-16 aspect-h-9 mb-4">
//                         <video controls className="w-full rounded-lg shadow-md">
//                             <source src={video?.videoFile} type="video/mp4" />
//                             <source src={video?.videoFile} type="video/webm" />
//                             <source src={video?.videoFile} type="video/ogg" />
//                             Your browser does not support the video tag.
//                         </video>
//                     </div>

//                     {/* Title and Channel Information */}
//                     <h1 className="text-2xl font-bold mb-2">{video?.title}</h1>
//                     <p className="text-lg">{video.description}</p>
//                     <br />
//                     <Link
//                         to={`/channel/${video?.owner?._id}`}
//                         className="flex items-center space-x-4 text-blue-400 hover:underline text-2xl"
//                     >
//                         <img
//                             src={video.owner.avatar || "https://via.placeholder.com/150"}
//                             alt={`${video.owner.fullName}'s avatar`}
//                             className="w-12 h-12 rounded-full border-2 border-gray-800 shadow-md"
//                         />
//                         <span>{video.owner.username || "Unknown Channel"}</span>
//                     </Link>

//                     {/* Like Button for Video */}
//                     <br />
//                     <button
//                         onClick={handleLikeClick}
//                         className={`text-2xl mt-4 ${liked ? "text-blue-600" : "text-gray-600"} text-white py-2 rounded-lg font-medium`}
//                     >
//                         {liked ? <FaThumbsUp /> : <FaThumbsUp />}
//                     </button>

//                     <br />
//                     <br />
//                     <h2 className="text-xl font-bold mb-4">Comments</h2>

//                     {/* Add Comment */}
//                     <div className="mb-6">
//                         <textarea
//                             className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400"
//                             placeholder="Write your comment here..."
//                             value={commentText}
//                             onChange={(e) => setCommentText(e.target.value)}
//                         ></textarea>
//                         <button
//                             onClick={handleCommentSubmit}
//                             className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium"
//                         >
//                             Post Comment
//                         </button>
//                     </div>

//                     {/* Display Comments */}
//                     <div className="space-y-4">
//                         {comments.length > 0 ? (
//                             comments.map((comment) => (
//                                 <div key={comment._id} className="bg-gray-700 rounded-lg p-4">
//                                     <p className="text-gray-300">
//                                         <span className="font-bold text-white">{comment.owner?.username || "Anonymous"}:</span>{" "}
//                                         {comment.content}
//                                     </p>
//                                     <p className="text-gray-500 text-sm">
//                                         {new Date(comment.createdAt).toLocaleString()}
//                                     </p>

//                                     {/* Like button for each comment */}
//                                     <div className="flex items-center space-x-2 mt-2">
//                                         <button
//                                             onClick={() => handleCommentLikeClick(comment._id)}
//                                             className={`text-xl ${comment.isLiked ? 'text-blue-500' : 'text-gray-500'}`}
//                                         >
//                                             {comment.isLiked ? <FaThumbsUp /> : <FaThumbsUp />} {/* Like/Unlike icon */}
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-gray-400">No comments yet. Be the first to comment!</p>
//                         )}
//                     </div>
//                 </div>
//                 {/* <div>
                    
//                 </div>
//                 <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    
//                 </div> */}
//             </div>
//         </div>
//     );
// }

// export default VideoDetail;
