import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [newAvatar, setNewAvatar] = useState(null);
    const [newCoverImage, setNewCoverImage] = useState(null);

    useEffect(() => {
        // Fetch current user details
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("You need to log in first.");
                    return;
                }

                const response = await axios.get("/api/v1/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const user = response.data.data;
                setFullName(user.fullName);
                setEmail(user.email);
                setAvatar(user.avatar);
                setCoverImage(user.coverImage);
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("Failed to fetch user details.");
            }
        };

        fetchUserDetails();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You need to log in first.");
                return;
            }

            const response = await axios.put(
                "/api/v1/users/update-profile",
                { fullName, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    const handleAvatarChange = async (e) => {
        e.preventDefault();
        if (!newAvatar) {
            alert("Please select an avatar image.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You need to log in first.");
                return;
            }

            const formData = new FormData();
            formData.append("avatar", newAvatar);

            const response = await axios.put("/api/v1/users/update-avatar", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setAvatar(response.data.data.avatar);
            alert("Avatar updated successfully!");
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("Failed to update avatar.");
        }
    };

    const handleCoverImageChange = async (e) => {
        e.preventDefault();
        if (!newCoverImage) {
            alert("Please select a cover image.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You need to log in first.");
                return;
            }

            const formData = new FormData();
            formData.append("coverImage", newCoverImage);

            const response = await axios.put(
                "/api/v1/users/update-cover-image",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setCoverImage(response.data.data.coverImage);
            alert("Cover image updated successfully!");
        } catch (error) {
            console.error("Error updating cover image:", error);
            alert("Failed to update cover image.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-bold text-center mb-8">Edit Profile</h2>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="block text-lg">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-lg">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 text-white"
                        />
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white p-3 rounded">
                        Save Profile
                    </button>
                </form>

                <div className="mt-10">
                    <h3 className="text-2xl mb-4">Change Avatar</h3>
                    <div className="flex flex-col items-center space-x-4">
                        <img
                            src={avatar || "/default-avatar.png"}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div className="flex flex-row items-center space-x-4">
                            <input
                                type="file"
                                onChange={(e) => setNewAvatar(e.target.files[0])}
                                className="text-white left-10"
                            />
                            <button
                                onClick={handleAvatarChange}
                                className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-3 rounded"
                            >
                                Update Avatar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <h3 className="text-2xl mb-4">Change Cover Image</h3>
                    <div className="relative">
                        <img
                            src={coverImage || "/default-cover.jpg"}
                            alt="Cover"
                            className="w-full h-40 object-cover rounded-lg"
                        />
                        <input
                            type="file"
                            onChange={(e) => setNewCoverImage(e.target.files[0])}
                            className="absolute left-4 mt-6 text-white"
                        />
                        <button
                            onClick={handleCoverImageChange}
                            className="absolute mt-6 right-28 bg-gradient-to-r from-pink-500 to-red-500 text-white p-3 rounded"
                        >
                            Update Cover Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
