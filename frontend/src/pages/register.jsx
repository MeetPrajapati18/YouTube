import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState(""); // For error messages
  const [loading, setLoading] = useState(false); // For loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "avatar") {
      setAvatar(files[0]);
    } else if (name === "coverImage") {
      setCoverImage(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation (Optional)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("avatar", avatar);
      formDataToSend.append("coverImage", coverImage);

      const response = await fetch("/api/v1/users/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful");
        setFormData({ fullName: "", username: "", email: "", password: "" }); // Reset form
        setAvatar(null); // Reset avatar
        setCoverImage(null); // Reset coverImage
      } else {
        setError(data.message || "Registration Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-6xl font-semibold mb-14 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-2xl font-medium" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-2xl font-medium" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-2xl font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-2xl font-medium" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-2xl font-medium" htmlFor="avatar">
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full mt-2 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-2xl font-medium" htmlFor="coverImage">
              Cover Image
            </label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full mt-2 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              // required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-lg text-center text-gray-400">
          Don't have an account? <Link
                to="/login" // Link to the Register page
                className="text-lg text-pink-500 hover:text-purple-400 transition duration-300"
              >
                Login
              </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;