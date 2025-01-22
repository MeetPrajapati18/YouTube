import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown menu

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setIsLoggedIn(true);
      fetchUserDetails();
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUser(data.data);
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text"
        >
          MediaMesh
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white text-2xl focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <nav
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center space-x-6 bg-gray-800 lg:bg-transparent lg:space-x-6`}
        >
          {!isLoggedIn ? (
            <>
              <Link
                to="/register"
                className="text-white text-lg hover:text-purple-400 transition duration-300"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="text-white text-lg hover:text-purple-400 transition duration-300"
              >
                Login
              </Link>
            </>
          ) : (
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)} // Show on hover
              // handleclickoutside={() => setIsDropdownOpen(false)} // Hide on mouse leave
            >
              {/* Profile Dropdown Trigger */}
              <button
                className="flex items-center text-white text-lg focus:outline-none"
                onClick={toggleDropdown}
                aria-label="Profile menu"
              >
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span className="text-3xl text-transparent bg-gradient-to-r from-purple-400 via-pink-600 to-red-500 bg-clip-text inline-block">{user?.username || "Profile"}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg z-50"
                  id="profileDropdown"
                >
                  <ul className="p-2 space-y-2">
                    <li>
                      <button
                        className="w-full text-left hover:text-purple-400"
                        onClick={() => alert("Refresh token functionality")}
                      >
                        Refresh Token
                      </button>
                    </li>
                    <li>
                      <Link
                        to="/change-password"
                        className="hover:text-purple-400"
                      >
                        Change Password
                      </Link>
                    </li>
                    <li>
                      <Link to="/edit-profile" className="hover:text-purple-400">
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left hover:text-purple-400"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
