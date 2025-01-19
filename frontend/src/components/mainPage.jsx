import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Main = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const fetchVideos = async (query = "") => {
    try {
      setIsLoading(true); // Start loading
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in to access videos.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("/api/v1/videos", {
        params: {
          query, // Pass the search query to the backend
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          sortType: "desc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(response.data.data);
      setError(null);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load videos. Please try again later.";
      setError(message);
      console.error("Error fetching videos:", err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Fetch videos on initial load
  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(searchQuery); // Fetch videos based on the search query
  };

  const incrementViews = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found for incrementing views.");
        return;
      }

      // Increment views
      await axios.patch(
        `/api/v1/videos/${videoId}/views`,
        {}, // Empty payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add video to watch history
      await axios.post(
        `/api/v1/users/watch-history`,
        { videoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Views incremented and video added to watch history.");
    } catch (err) {
      console.error("Error updating video views or adding to watch history:", err);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <main className="py-8 bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto">
        {/* <h2 className="text-xl mb-4 font-bold text-gray-200">Trending Now</h2> */}

        {/* Search Bar */}
        <form className="mb-6 text-center" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for videos..."
            className="p-2 rounded bg-gray-800 text-white w-full md:w-1/2"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 rounded bg-purple-600 hover:bg-pink-400 text-white"
          >
            Search
          </button>
        </form>

        {/* Video Grid */}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <Link
                  to={`/videos/${video._id}`}
                  onClick={() => incrementViews(video._id)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-400">{video.owner?.fullName}</p>
                    <p className="text-sm text-gray-500">{video.views} views</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Main;