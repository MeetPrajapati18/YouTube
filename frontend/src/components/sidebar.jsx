import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserEdit,
  FaHistory,
  FaPlayCircle,
  FaPlus,
  FaVideo,
  FaTwitter,
} from "react-icons/fa";

const Sidebar = ({ username, userId }) => {
  return (
    <>
      {/* Vertical Sidebar for Desktop */}
      <div className="hidden md:flex w-46 bg-gray-800 text-white flex-col h-full">
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
              >
                <FaVideo className="text-3xl mb-2" />
                <span>Videos</span>
              </Link>
            </li>
            {/* <li>
              <Link
                to="/tweet"
                className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
              >
                <FaTwitter className="text-3xl mb-2" />
                <span>Tweets</span>
              </Link>
            </li> */}
            <li>
              <Link
                // Remove the "to" attribute to prevent navigation
                className="flex flex-col items-center text-gray-400 p-4 rounded"
                style={{
                  pointerEvents: 'none',
                  cursor: 'url(data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10" fill="red" /%3E%3C/svg%3E) 12 12, auto',
                }}
              >
                <FaTwitter className="text-3xl mb-2" />
                <span>Tweets</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/view-profile/${username}`}
                className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
              >
                <FaUserEdit className="text-3xl mb-2" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/subscriptions"
                className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
              >
                <FaPlayCircle className="text-3xl mb-2" />
                <span>Subscriptions</span>
              </Link>
            </li>
            <li>
              <Link
                to="/addVideo"
                className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
              >
                <FaPlus className="text-3xl mb-2" />
                <span>Add Video</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/user/${userId}/videos`}
                className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
              >
                <FaVideo className="text-3xl mb-2" />
                <span>User Videos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Horizontal Menu for Mobile */}
      <div className="flex md:hidden fixed bottom-0 left-0 w-full bg-gray-800 text-white">
        <nav className="flex justify-around w-full py-2">
          <Link
            to="/"
            className="flex flex-col items-center text-gray-300 hover:text-purple-300"
          >
            <FaVideo className="text-2xl" />
            <span className="text-xs">Videos</span>
          </Link>
          <Link
            to="/tweet"
            className="flex flex-col items-center text-gray-300 hover:text-purple-300"
          >
            <FaTwitter className="text-2xl" />
            <span className="text-xs">Tweets</span>
          </Link>
          <Link
            to={`/view-profile/${username}`}
            className="flex flex-col items-center text-gray-300 hover:text-purple-300"
          >
            <FaUserEdit className="text-2xl" />
            <span className="text-xs">Profile</span>
          </Link>
          <Link
            to="/subscriptions"
            className="flex flex-col items-center text-gray-300 hover:text-purple-300"
          >
            <FaPlayCircle className="text-2xl" />
            <span className="text-xs">Subs</span>
          </Link>
          <Link
            to="/addVideo"
            className="flex flex-col items-center text-gray-300 hover:text-purple-300"
          >
            <FaPlus className="text-2xl" />
            <span className="text-xs">Add</span>
          </Link>
          <Link
            to={`/user/${userId}/videos`}
            className="flex flex-col items-center text-gray-300 hover:text-purple-300"
          >
            <FaVideo className="text-2xl" />
            <span className="text-xs">My Videos</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;