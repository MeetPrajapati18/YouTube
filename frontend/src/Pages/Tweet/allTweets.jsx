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
      alert("Failed to toggle like status.");
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [query, sortBy, sortType]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-center mb-4">Tweets</h1>

      {/* Search and Sorting */}
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="Search tweets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring focus:ring-blue-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 focus:ring focus:ring-blue-500 focus:outline-none"
          >
            <option value="createdAt">Date</option>
            <option value="content">Content</option>
          </select>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 focus:ring focus:ring-blue-500 focus:outline-none"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Tweets List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-blue-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : tweets.length === 0 ? (
          <p className="text-center text-gray-500">No tweets found.</p>
        ) : (
          tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-gray-800 rounded p-4 shadow hover:shadow-lg transition"
            >
              <p>{tweet.content}</p>
              <div className="text-sm text-gray-400 mt-2">
                By: {tweet.owner?.username || "Unknown"} |{" "}
                {new Date(tweet.createdAt).toLocaleString()}
              </div>
              {/* <button
                onClick={() => handleLikeClick(tweet._id)}
                className={`mt-2 flex items-center gap-2 ${
                  tweet.isLiked ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <FaThumbsUp />
                <span>{tweet.likeCount} Likes</span>
              </button> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TweetsPage;