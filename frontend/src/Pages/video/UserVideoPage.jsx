import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const UserVideosPage = () => {
  const { userId } = useParams();
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [videoError, setVideoError] = useState(null);
  const [tweetError, setTweetError] = useState(null);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingTweets, setLoadingTweets] = useState(true);

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const response = await axios.get(`/api/v1/videos/user/${userId}`, {
          params: {
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            sortType: "desc",
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setVideos(response.data.data);
      } catch (err) {
        setVideoError("Failed to load videos. Please try again later.");
        console.error(err);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchUserVideos();
    return () => {
      setLoadingVideos(false);
    };
  }, [userId]);

  useEffect(() => {
    const fetchUserTweets = async () => {
      try {
        const response = await axios.get(`/api/v1/tweets/user/${userId}`, {
          params: { sortBy: "createdAt", sortType: "desc" },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Tweets API response:", response.data);
        setTweets(response.data.data.tweets);
      } catch (err) {
        setTweetError("Failed to load tweets. Please try again later.");
        console.error(err);
      } finally {
        setLoadingTweets(false);
      }
    };

    fetchUserTweets();
  }, [userId]);

  const handleDelete = async (videoId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this video?");
      if (!confirmed) return;

      await axios.delete(`/api/v1/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));

      alert("Video deleted successfully!");
    } catch (err) {
      console.error("Failed to delete video:", err);
      alert("Failed to delete video. Please try again later.");
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      const response = await axios.patch(`/api/v1/videos/toggle/publish/${videoId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId ? { ...video, isPublished: response.data.data.isPublished } : video
        )
      );

      alert(`Video is now ${response.data.data.isPublished ? "published" : "unpublished"}.`);
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
      alert("Failed to toggle publish status. Please try again later.");
    }
  };

  if (loadingVideos) {
    return <div className="text-gray-400">Loading videos...</div>;
  }
  if (videoError) {
    return <div className="text-red-500">{videoError}</div>;
  }

  // Tweets Loading/Error
  if (loadingTweets) {
    return <div className="text-gray-400">Loading tweets...</div>;
  }
  if (tweetError) {
    return <div className="text-red-500">{tweetError}</div>;
  }

  return (
    <main className="py-8 bg-gray-900 text-white min-h-screen">
      <div className="container text-center mx-auto">
        <h2 className="text-4xl py-4 font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-600 to-red-500 bg-clip-text inline-block">User's Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.length === 0 ? (
            <div>No videos found for this user.</div>
          ) : (
            videos.map((video) => (
              <div key={video._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <Link to={`/videos/${video._id}`}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-400">{video.owner?.fullName || "Unknown"}</p>
                  {/* <p className="text-sm text-gray-500">{video.views || "No views yet"} views</p> */}
                  <div className="mt-4 flex gap-4">
                    <Link
                      to={`/videos/${video._id}/edit`}
                      className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Edit Video
                    </Link>
                    
                    <button
                      onClick={() => handleTogglePublish(video._id)}
                      className={`inline-block px-4 py-2 rounded-md text-sm font-medium ${
                        video.isPublished
                          ? "bg-pink-400 hover:bg-pink-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {video.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      to={`/videos/${video._id}/comments`}
                      className="inline-block bg-pink-600 hover:bg-pink-800 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Manage Comments
                    </Link>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Delete Video
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tweets section */}
        <h2 className="text-4xl text-center py-4 font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-600 to-red-500 bg-clip-text inline-block">User's Tweets</h2>
        <div className="space-y-4 text-left">
          {tweets.length === 0 ? (
            <div>No tweets found for this user.</div>
          ) : (
            Array.isArray(tweets) &&
            tweets.map((tweet) => (
              <div key={tweet._id} className="bg-gray-800 rounded-lg shadow-lg p-4">
                <h3 className="text-lg text-gray-400 font-semibold">{tweet.content}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(tweet.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default UserVideosPage;