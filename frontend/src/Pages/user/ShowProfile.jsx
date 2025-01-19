import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ShowProfile() {
    const { profileId } = useParams(); // Extract user ID from the route
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false); // Subscription state

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`/api/v1/channel/${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data.data); // Assuming backend returns user data in `data`
                checkSubscriptionStatus(); // Check subscription status
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Failed to fetch user profile.");
            } finally {
                setLoading(false);
            }
        };

        // Fetch profile details
        fetchUserProfile();
    }, [profileId]);

    const checkSubscriptionStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`/api/v1/channel/${profileId}/subscribed`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Check if the logged-in user is already subscribed
            if (response.data.success && response.data.isSubscribed) {
                setIsSubscribed(true);
            } else {
                setIsSubscribed(false);
            }
        } catch (err) {
            console.error("Error checking subscription status:", err);
            setError("Failed to check subscription status.");
        }
    };

    const handleToggleSubscription = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`/api/v1/channel/c/${profileId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setIsSubscribed(prevState => !prevState); // Toggle subscription state
            }
        } catch (err) {
            console.error("Error toggling subscription:", err);
        }
    };

    if (loading) {
        return <div className="text-gray-400">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="container mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={user.avatar || "https://via.placeholder.com/150"}
                        alt={`${user.fullName}'s avatar`}
                        className="w-20 h-20 rounded-full border-4 border-gray-800 shadow-lg"
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{user.fullName || "Unknown User"}</h1>
                        <p className="text-gray-400">@{user.username}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
                    <p>
                        <strong>Email:</strong> {user.email || "N/A"}
                    </p>
                    <p>
                        <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString() || "N/A"}
                    </p>
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleToggleSubscription}
                        className={`px-4 py-2 ${isSubscribed ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg`}
                    >
                        {isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShowProfile;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// function ShowProfile() {
//     const { profileId } = useParams(); // Extract user ID from the route
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isSubscribed, setIsSubscribed] = useState(false); // Subscription state

//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await axios.get(`/api/v1/channel/${profileId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setUser(response.data.data); // Assuming backend returns user data in `data`
//                 setIsSubscribed(response.data.data.isSubscribed); // Set subscription state
//             } catch (err) {
//                 console.error("Error fetching user profile:", err);
//                 setError("Failed to fetch user profile.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserProfile();
//     }, [profileId]);

//     const handleToggleSubscription = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.post(`/api/v1/channel/c/${profileId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             if (response.data.success) {
//                 setIsSubscribed(prevState => !prevState); // Toggle the subscription state
//             }
//         } catch (err) {
//             console.error("Error toggling subscription:", err);
//         }
//     };

//     if (loading) {
//         return <div className="text-gray-400">Loading profile...</div>;
//     }

//     if (error) {
//         return <div className="text-red-500">{error}</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-6">
//             <div className="container mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
//                 <div className="flex items-center space-x-4">
//                     <img
//                         src={user.avatar || "https://via.placeholder.com/150"}
//                         alt={`${user.fullName}'s avatar`}
//                         className="w-20 h-20 rounded-full border-4 border-gray-800 shadow-lg"
//                     />
//                     <div>
//                         <h1 className="text-3xl font-bold">{user.fullName || "Unknown User"}</h1>
//                         <p className="text-gray-400">@{user.username}</p>
//                     </div>
//                 </div>
//                 <div className="mt-6">
//                     <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
//                     <p>
//                         <strong>Email:</strong> {user.email || "N/A"}
//                     </p>
//                     <p>
//                         <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString() || "N/A"}
//                     </p>
//                 </div>
//                 <div className="mt-6">
//                     <button
//                         onClick={handleToggleSubscription}
//                         className={`px-4 py-2 ${isSubscribed ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg`}
//                     >
//                         {isSubscribed ? "Unsubscribe" : "Subscribe"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ShowProfile;