import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp } from "react-icons/fa";

const TweetsPage = () => {
  const [tweets, setTweets] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTweets = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`/api/v1/tweets/`, {
        params: { query, sortBy, sortType },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTweets(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch tweets");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = async (id) => {
    try {
      console.log("Tweet ID:", id); // Log the ID to verify it's correct
      const response = await axios.post(
        `/api/v1/likes/toggle/t/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === id
            ? { ...tweet, isLiked: !tweet.isLiked, likeCount: response.data.likeCount }
            : tweet
        )
      );
    } catch (err) {
      console.error("Error toggling like status:", err);
      alert("Failed to toggle like status. Please check the console for details.");
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [query, sortBy, sortType]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <h1 className="text-4xl mb-6 font-semibold mb-14 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">All Tweets</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tweets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-600 bg-gray-800 rounded p-2 w-64 text-gray-100 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-600 bg-gray-800 rounded p-2 text-gray-100 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="createdAt">Date</option>
          <option value="content">Content</option>
        </select>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border border-gray-600 bg-gray-800 rounded p-2 text-gray-100 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Tweets List */}
      <div className="w-full max-w-3xl">
        {loading ? (
          <p className="text-center text-blue-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : tweets.length === 0 ? (
          <p className="text-center text-gray-500">No tweets found.</p>
        ) : (
          <ul className="space-y-4">
            {tweets.map((tweet) => (
              <li
                key={tweet._id}
                className="p-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-sm"
              >
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-100">{tweet.content}</p>
                  <div className="text-sm text-gray-400 mt-2">
                    By: {tweet.owner?.username || "Unknown"} |{" "}
                    {new Date(tweet.createdAt).toLocaleString()}
                  </div>
                  {/* <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => handleLikeClick(tweet._id)}
                    className={`text-xl ${
                      tweet.isLiked ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <FaThumbsUp />
                  </button>
                  <span className="text-sm text-gray-400">{tweet.likeCount} likes</span>
                </div> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TweetsPage;