import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

const ViewProfile = () => {
    const { username } = useParams(); // Fetch username from route params
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) {
            console.error("Username is undefined. Cannot fetch profile.");
            setError("Invalid username provided.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/v1/users/channel-profile/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch profile: ${response.statusText}`);
                }

                const data = await response.json();
                setProfile(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <div className="loader mb-4"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <div className="text-center bg-red-500 p-4 rounded-md">
                    <h1 className="text-xl font-bold mb-2">Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className=" bg-gray-900 text-white rounded-lg shadow-md max-w-8xl mx-auto">
            {/* Cover Image */}
            {profile.coverImage && (
                <div className="mb-4">
                    <img
                        src={profile.coverImage}
                        alt={`${profile.username}'s cover`}
                        className="w-full h-48 object-cover rounded-md"
                    />
                </div>
            )}

            {/* Profile Info */}
            <div className="flex items-center space-x-4">
                {/* Avatar */}
                <img
                    src={profile.avatar || "https://via.placeholder.com/150"}
                    alt={`${profile.username}'s avatar`}
                    className="w-24 h-24 rounded-full border-4 border-gray-800 shadow-lg"
                />

                {/* User Details */}
                <div>
                    <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                    <p className="text-gray-400 text-lg">@{profile.username}</p>
                    <a href={`mailto:${profile.mail}`} className=""><p className="text-auto">{profile.email}</p></a>
                </div>
            </div>

            {/* Profile Stats */}
            <div className="mt-6 grid grid-cols-1 gap-4 text-sm">
                <div className="bg-gray-800 p-4 rounded-md">
                    <h2 className="font-bold text-lg">Subscribers: {profile.subscribersCount}</h2>
                    <h2 className="font-bold text-lg">Subscribing: {profile.channelsSubscribedToCount}</h2>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;