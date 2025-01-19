import React, { useEffect, useState } from "react";
import axios from "axios";

function Subscription({ user }) {
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("User ID:", user?._id); // Debugging userId

        const fetchSubscriptions = async () => {
            try {
                if (!user?._id) {
                    setError("User not found. Please log in again.");
                    return;
                }
                const token = localStorage.getItem("token");

                // Debugging API calls
                console.log("Fetching subscribed channels...");
                const subscribedResponse = await axios.get(
                    `/api/v1/channel/c/${user._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("Subscribed Channels:", subscribedResponse.data);

                const subscribersResponse = await axios.get(
                    `/api/v1/channel/u/${user._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("Subscribers:", subscribersResponse.data);

                setSubscribedChannels(subscribedResponse.data.data);
                setSubscribers(subscribersResponse.data.data);
            } catch (err) {
                console.error("Error fetching subscriptions:", err);
                setError("Failed to load subscription data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [user]);



    if (loading) return <div className="text-gray-400">Loading subscriptions...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="min-h-screen text-center bg-gray-900 text-white p-6">
            <div className="container mx-auto mb-4 bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-600 to-red-500 bg-clip-text inline-block">
                    Your Subscriptions
                </h1>
            </div>
            <div className="container mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="mb-8">
                    <h2 className="text-2xl py-4 font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-600 to-red-500 bg-clip-text inline-block">Channels You Subscribed To</h2>
                    {subscribedChannels.length === 0 ? (
                        <p className="text-gray-400">You are not subscribed to any channels.</p>
                    ) : (
                        <ul className="space-y-4">
                            {subscribedChannels.map((channel) => (
                                <li key={channel._id} className="flex items-center space-x-4">
                                    <img
                                        src={channel.avatar || "https://via.placeholder.com/50"}
                                        alt={`${channel.fullName}'s avatar`}
                                        className="w-12 h-12 rounded-full border border-gray-700"
                                    />
                                    <div>
                                        <p className="font-bold">{channel.fullName}</p>
                                        <p className="text-gray-400">@{channel.username}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl py-4 font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-600 to-red-500 bg-clip-text inline-block">Your Subscribers</h2>
                    {subscribers.length === 0 ? (
                        <p className="text-gray-400">You don't have any subscribers yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {subscribers.map((subscriber) => (
                                <li key={subscriber._id} className="flex items-center space-x-4">
                                    <img
                                        src={subscriber.avatar || "https://via.placeholder.com/50"}
                                        alt={`${subscriber.fullName}'s avatar`}
                                        className="w-12 h-12 rounded-full border border-gray-700"
                                    />
                                    <div>
                                        <p className="font-bold">{subscriber.fullName}</p>
                                        <p className="text-gray-400">@{subscriber.username}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Subscription;