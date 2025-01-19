import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import Sidebar from "./components/sidebar.jsx";
import Main from "./components/mainPage.jsx";
import Register from "./Pages/user/register.jsx";
import Login from "./Pages/user/login.jsx";
import ChangePassword from "./Pages/user/changePassword.jsx";
import EditProfile from "./Pages/user/editProfile.jsx";
import ViewProfile from "./Pages/user/viewProfile.jsx";
import WatchHistory from "./Pages/user/watchHistory.jsx";
import AddVideoFile from "./Pages/video/addVideo.jsx";
import VideoDetail from "./Pages/video/VideoDetail.jsx";
import UpdateVideo from "./Pages/video/updateVideo.jsx";
import UserVideosPage from "./Pages/video/UserVideoPage.jsx";
import EditCommentPage from "./Pages/video/EditCommentPage.jsx";
import TweetsPage from "./Pages/Tweet/allTweets.jsx";
import ShowProfile from "./Pages/user/ShowProfile.jsx";
import Subscription from "./Pages/user/Subscription.jsx";

// Protected route to check authentication
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/v1/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) fetchUserDetails();
    else setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="flex sticky flex-col min-h-screen bg-gray-900 text-white">
        <Header user={user} />
        <div className="flex flex-1">
          <Sidebar username={user?.username} userId={user?._id} />
          <div className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/tweet" element={<TweetsPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/videos/:id" element={<VideoDetail />} />
              <Route path="/videos/:videoId/edit" element={<UpdateVideo />} />
              <Route path="/user/:userId/videos" element={<UserVideosPage />} />
              <Route path="/videos/:videoId/comments" element={<EditCommentPage />} />
              <Route path="/change-password" element={<ProtectedRoute element={<ChangePassword />} />} />
              <Route path="/edit-profile" element={<ProtectedRoute element={<EditProfile />} />} />
              <Route path="/view-profile/:username" element={<ProtectedRoute element={<ViewProfile />} />} />
              <Route path="/channel/:profileId" element={<ShowProfile />} />
              <Route path="/subscriptions" element={<Subscription user={user} />}/>
              <Route path="/history" element={<ProtectedRoute element={<WatchHistory />} />} />
              <Route path="/addVideo" element={<ProtectedRoute element={<AddVideoFile />} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;