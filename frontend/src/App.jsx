import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import Main from "./components/mainPage.jsx"; // Import Main component
import Register from "./pages/register.jsx"; // Import Register component
import Login from "./pages/login.jsx"; // Import Login component

function App() {
  // const [jokes, setJokes] = useState([]);

  // useEffect(() => {
  //   axios.get('/api/v1/jokes')
  //     .then((response) => {
  //       setJokes(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        <Routes>
          {/* Define Routes here */}
          <Route path="/" element={<Main />} /> {/* Main component for Home */}
          <Route path="/register" element={<Register />} /> {/* Register component for /register */}
          <Route path="/login" element={<Login />} /> {/* Register component for /register */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
