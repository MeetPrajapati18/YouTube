import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUserEdit, FaHistory, FaPlayCircle, FaPlus, FaVideo, FaTwitter } from "react-icons/fa";

const Sidebar = ({ username, userId }) => {
  return (
    <div className="w-46 bg-gray-800 text-white flex flex-col h-full">
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
          <li>
            <Link
              to="/tweet"
              className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
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
          {/* <li>
            <Link
              to="/history"
              className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
            >
              <FaHistory className="text-3xl" />
              <span>History</span>
            </Link>
          </li> */}
          <li>
            <Link
              to="/addVideo"
              className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
            >
              <FaPlus className="text-3xl" />
              <span>Add Video</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/user/${userId}/videos`}
              className="flex flex-col items-center text-gray-300 hover:text-purple-300 hover:bg-gray-700 p-4 rounded"
            >
              <FaVideo className="text-3xl" />
              <span>User Videos</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;