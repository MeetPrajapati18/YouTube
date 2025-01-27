import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // For username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const isEmail = identifier.includes("@");
      const payload = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };
  
      console.log("Payload:", payload);
      console.log("Identifier:", identifier);
      
      const response = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("response", response);  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid username/email or password");
      }
  
      const data = await response.json();
      console.log("Login successful:", data);
  
      if (data.success) {
        // Save both access and refresh tokens
        localStorage.setItem("token", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken); // Save refreshToken here
  
        // Redirect to home and refresh the page
        navigate("/");
        window.location.reload();
  
        // Optional: Clear input fields
        setIdentifier("");
        setPassword("");
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-6xl font-semibold mb-14 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-2xl font-medium text-gray-300 mb-2"
              htmlFor="identifier"
            >
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username or email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-2xl font-medium text-gray-300 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-lg text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:text-pink-500">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
