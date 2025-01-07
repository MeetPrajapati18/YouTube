// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Header = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu

//   // On component mount, check if a token exists in localStorage
//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     setIsLoggedIn(!!savedToken); // Set logged-in state based on token existence
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/api/v1/users/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error("Logout failed");
//       }

//       // Clear client-side session and token storage
//       localStorage.removeItem("token");
//       localStorage.removeItem("refreshToken");
//       sessionStorage.clear();

//       // Update the logged-in state
//       setIsLoggedIn(false);

//       // Close the dropdown menu
//       setIsDropdownOpen(false);

//       // Redirect to login page after logout
//       navigate("/");
//     } catch (err) {
//       console.error("Error during logout:", err.message);
//     }
//   };

//   const handleToggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
//   };

//   return (
//     <header className="bg-gray-800 p-4 shadow-lg">
//       <div className="container mx-auto flex items-center justify-between">
//         <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text">
//           VideoStream
//         </h1>

//         <nav>
//           <ul className="flex space-x-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
//             <li>
//               <Link to="/" className="text-2xl hover:text-purple-400 transition duration-300">
//                 Home
//               </Link>
//             </li>
//             {!isLoggedIn ? (
//               <>
//                 <li>
//                   <Link to="/register" className="text-2xl hover:text-purple-400 transition duration-300">
//                     Register
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/login" className="text-2xl hover:text-purple-400 transition duration-300">
//                     Login
//                   </Link>
//                 </li>
//               </>
//             ) : (
//               <li className="relative">
//                 {/* Profile Dropdown Menu */}
//                 <button
//                   onClick={handleToggleDropdown}
//                   className="text-2xl bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent hover:text-purple-400 transition duration-300 focus:outline-none"
//                 >
//                   Profile
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 bg-white text-black p-3 shadow-lg rounded-md">
//                     <ul>
//                       <li className="cursor-pointer mb-2" onClick={handleLogout}>
//                         Logout
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </li>
//             )}
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;



import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu

  // On component mount, check if a token exists in localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setIsLoggedIn(!!savedToken); // Set logged-in state based on token existence
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear client-side session and token storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();

      // Update the logged-in state
      setIsLoggedIn(false);

      // Close the dropdown menu
      setIsDropdownOpen(false);

      // Redirect to login page after logout
      navigate("/");
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found. Please log in again.");
      }

      const response = await fetch("/api/v1/users/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      const { token } = data;

      // Update the token in localStorage
      localStorage.setItem("token", token);

      alert("Token refreshed successfully!");
    } catch (err) {
      console.error("Error during token refresh:", err.message);
      alert("Failed to refresh token. Please log in again.");
    }
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  return (
    <header className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text">
          VideoStream
        </h1>

        <nav>
          <ul className="flex space-x-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            <li>
              <Link to="/" className="text-2xl hover:text-purple-400 transition duration-300">
                Home
              </Link>
            </li>
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
              <li className="relative">
                {/* Profile Dropdown Menu */}
                <button
                  onClick={handleToggleDropdown}
                  className="text-2xl bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent hover:text-purple-400 transition duration-300 focus:outline-none"
                >
                  Profile
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black p-3 shadow-lg rounded-md">
                    <ul>
                      <li className="cursor-pointer mb-2" onClick={handleRefreshToken}>
                        Refresh Token
                      </li>
                      <li className="cursor-pointer" onClick={handleLogout}>
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
