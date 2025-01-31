import React, { useState } from "react";
import axios from "axios";

const AddVideoFile = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [message, setMessage] = useState("");
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetContent, setTweetContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !duration || !videoFile || !thumbnailFile) {
      setMessage("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      setMessage("Uploading...");
      const response = await axios.post("/api/v1/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Response:", response.data); // Debugging
      setMessage(response.data.message || "Video uploaded successfully!");
    } catch (error) {
      console.error("Error:", error.response || error); // Debugging
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();

    if (!tweetContent.trim()) {
      setTweetMessage("Tweet content is required.");
      return;
    }

    try {
      setTweetMessage("Posting...");
      const response = await axios.post("/api/v1/tweets",
        {
          content: tweetContent
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        },
      );

      setTweetMessage(response.data.message || "Tweet posted successfully!");
      setTweetContent("");
    } catch (error) {
      console.error(error);
      setTweetMessage(
        error.response?.data?.message || "Failed to post tweet. Try again."
      );
    }
  };

  return (
    <div className="px-4 sm:px-8 py-10 min-h-screen bg-dark">
      <div className="w-full bg-grey-100 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl sm:text-4xl mb-6 font-semibold mb-14 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">
          Publish a Video
        </h1>
        {message && (
          <div
            className={`p-4 mb-6 text-sm rounded ${message.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-xl sm:text-2xl font-medium text-gray-400"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-xl sm:text-2xl font-medium text-gray-400"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="duration"
              className="block text-xl sm:text-2xl font-medium text-gray-400"
            >
              Duration (in seconds)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="video"
              className="block text-xl sm:text-2xl font-medium text-gray-400"
            >
              Video File
            </label>
            <input
              type="file"
              id="video"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="mt-1 block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              required
            />
          </div>
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-xl sm:text-2xl font-medium text-gray-400"
            >
              Thumbnail Image
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              className="mt-1 block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-medium text-lg rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Publish Video
          </button>
        </form>
      </div>

      {/* Tweet Creation Section */}
      <div className="w-full bg-grey-100 shadow-lg rounded-lg p-8 mt-12">
        <h1 className="text-3xl sm:text-4xl mb-6 font-semibold mb-14 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">
          Create a Tweet
        </h1>
        {tweetMessage && (
          <div
            className={`p-4 mb-6 text-sm rounded ${tweetMessage.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {tweetMessage}
          </div>
        )}
        <form onSubmit={handleTweetSubmit} className="space-y-6">
          <textarea
            id="tweetContent"
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="4"
            placeholder="What's on your mind?"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-medium text-lg rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Post Tweet
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVideoFile;

// import React, { useState } from "react";
// import axios from "axios";

// const AddVideoFile = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [duration, setDuration] = useState("");
//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [tweetMessage, setTweetMessage] = useState("");
//   const [tweetContent, setTweetContent] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !description || !duration || !videoFile || !thumbnailFile) {
//       setMessage("All fields are required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("duration", duration);
//     formData.append("videoFile", videoFile);
//     formData.append("thumbnail", thumbnailFile);

//     try {
//       setMessage("Uploading...");
//       const response = await axios.post("/api/v1/videos/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       console.log("Response:", response.data); // Debugging
//       setMessage(response.data.message || "Video uploaded successfully!");
//     } catch (error) {
//       console.error("Error:", error.response || error); // Debugging
//       setMessage(
//         error.response?.data?.message || "Something went wrong. Try again."
//       );
//     }
//   };

//   const handleTweetSubmit = async (e) => {
//     e.preventDefault();

//     if (!tweetContent.trim()) {
//       setTweetMessage("Tweet content is required.");
//       return;
//     }

//     try {
//       setTweetMessage("Posting...");
//       const response = await axios.post("/api/v1/tweets",
//         {
//           content: tweetContent
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           }
//         },
//       );

//       setTweetMessage(response.data.message || "Tweet posted successfully!");
//       setTweetContent("");
//     } catch (error) {
//       console.error(error);
//       setTweetMessage(
//         error.response?.data?.message || "Failed to post tweet. Try again."
//       );
//     }
//   };

//   return (
//     <div className="px-80 py-10 min-h-screen bg-dark">
//       <div className="w-full max-w-3xl bg-grey-100 shadow-lg rounded-lg p-8">
//         <h1 className="text-4xl mb-6 font-semibold mb-14 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">Publish a Video</h1>
//         {message && (
//           <div
//             className={`p-4 mb-6 text-sm rounded ${message.includes("successfully")
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//               }`}
//           >
//             {message}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="title"
//               className="block text-xl font-medium bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
//             >
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               required
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="description"
//               className="block text-xl font-medium bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
//             >
//               Description
//             </label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               rows="4"
//               required
//             ></textarea>
//           </div>
//           <div>
//             <label
//               htmlFor="duration"
//               className="block text-xl font-medium bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
//             >
//               Duration (in seconds)
//             </label>
//             <input
//               type="number"
//               id="duration"
//               value={duration}
//               onChange={(e) => setDuration(e.target.value)}
//               className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               required
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="video"
//               className="block text-xl font-medium text-purple-400"
//             >
//               Video File
//             </label>
//             <input
//               type="file"
//               id="video"
//               accept="video/*"
//               onChange={(e) => setVideoFile(e.target.files[0])}
//               className="mt-1 block w-full text-purple-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
//               required
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="thumbnail"
//               className="block text-xl font-medium text-purple-400"
//             >
//               Thumbnail Image
//             </label>
//             <input
//               type="file"
//               id="thumbnail"
//               accept="image/*"
//               onChange={(e) => setThumbnailFile(e.target.files[0])}
//               className="mt-1 block w-full text-purple-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Publish Video
//           </button>
//         </form>
//       </div>


//       {/* Tweet Creation Section */}
//       <div className="w-full max-w-3xl bg-grey-100 shadow-lg rounded-lg p-8">
//         <h1 className="text-4xl mb-6 font-semibold mb-14 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">Create a Tweet</h1>
//         {tweetMessage && (
//           <div
//             className={`p-4 mb-6 text-sm rounded ${tweetMessage.includes("successfully")
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//               }`}
//           >
//             {tweetMessage}
//           </div>
//         )}
//         <form onSubmit={handleTweetSubmit} className="space-y-6">
//           <textarea
//             id="tweetContent"
//             value={tweetContent}
//             onChange={(e) => setTweetContent(e.target.value)}
//             className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             rows="4"
//             placeholder="What's on your mind?"
//             required
//           ></textarea>
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Post Tweet
//           </button>
//         </form>
//       </div>

//     </div>
//   );
// };

// export default AddVideoFile;
