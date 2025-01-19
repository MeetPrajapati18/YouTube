import React, { useEffect, useState } from "react";
import axios from "axios";

const WatchHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWatchHistory = async () => {
            try {
                const response = await axios.get("/api/v1/users/watch-history", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log("API Response:", response.data); // Debugging
                setHistory(response.data);
            } catch (err) {
                console.error("Error fetching watch history:", err); // Debugging
                setError("Failed to fetch watch history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchWatchHistory();
    }, []);    

    if (loading) return <div className="text-center mt-4">Loading watch history...</div>;
    if (error) return <div className="text-center mt-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Watch History</h1>
            {Array.isArray(history) && history.length === 0 ? (
                <p className="text-center">No watch history available.</p>
            ) : (
                <ul className="space-y-4">
                    {Array.isArray(history) &&
                        history.map((item) => (
                            <li
                                key={item.id}
                                className="border p-4 rounded-lg shadow-md flex items-center justify-between"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">{item.videoTitle}</h2>
                                    <p className="text-sm text-gray-500">
                                        Last watched:{" "}
                                        {new Date(item.lastWatched).toLocaleString()}
                                    </p>
                                </div>
                                <a
                                    href={`/videos/${item.videoId}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Watch Again
                                </a>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};    

export default WatchHistory;