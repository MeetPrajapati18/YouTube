import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // State for storing user details
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu visibility

  // On component mount, check if a token exists in localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setIsLoggedIn(true);
      fetchUserDetails(); // Fetch user details if logged in
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/v1/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUser(data.data); // Assuming 'data.data' contains the user details
    } catch (err) {
      console.error("Error fetching user details:", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };
  

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("profileDropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Attach event listener to detect clicks outside the dropdown
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text">
          VideoStream
        </h1>

        <nav>
          <ul className="flex space-x-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            {/*<li>*/}
            {/*  <Link to="/register" className="text-2xl hover:text-purple-400 transition duration-300">*/}
            {/*    Register*/}
            {/*  </Link>*/}
            {/*</li>*/}
            {/*<li>*/}
            {/*  <Link to="/login" className="text-2xl hover:text-purple-400 transition duration-300">*/}
            {/*    Login*/}
            {/*  </Link>*/}
            {/*</li>*/}
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/register" className="text-2xl hover:text-purple-400 transition duration-300">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-2xl hover:text-purple-400 transition duration-300">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="relative" onMouseEnter={() => setIsDropdownOpen(true)}>
                {/* Profile Dropdown Menu */}
                <button
                  className="text-3xl text-transparent bg-gradient-to-r from-purple-400 via-pink-600 to-red-500 bg-clip-text inline-block"
                >
                  <div className="flex items-center space-x-2">
                    {user?.avatar && (
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                    )}
                    <span>{user?.username || "Profile"}</span>
                  </div>
                </button>
                {isDropdownOpen && (
                  <div
                    id="profileDropdown"
                    className="absolute right-0 mt-2 bg-black text-pink-500 text-semibold p-3 shadow-lg rounded-md"
                  >
                    <ul>
                      <li className="cursor-pointer hover:text-purple-400 transition duration-300 mb-4" onClick={() => alert("Refresh token functionality")}>
                        Refresh Token
                      </li>
                      <li className="cursor-pointer hover:text-purple-400 transition duration-300 mb-4">
                        <Link to="/change-password">Change password</Link>
                      </li>
                      <li className="cursor-pointer hover:text-purple-400 transition duration-300 mb-4">
                        <Link to="/edit-profile">Edit Profile</Link>
                      </li>
                      <li className="cursor-pointer hover:text-purple-400 transition duration-300 mb-2" onClick={handleLogout}>
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;