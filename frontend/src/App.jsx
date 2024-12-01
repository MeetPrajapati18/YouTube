import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    axios.get('/api/v1/jokes')
      .then((response) => {
        setJokes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            VideoStream
          </h1>
          <nav>
            <ul className="flex space-x-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              <li>
                <a href="#" className="text-lg hover:text-purple-400 transition duration-300">Home</a>
              </li>
              <li>
                <a href="#" className="text-lg hover:text-purple-400 transition duration-300">Trending</a>
              </li>
              <li>
                <a href="#" className="text-lg hover:text-purple-400 transition duration-300">Subscriptions</a>
              </li>
              <li>
                <a href="#" className="text-lg hover:text-purple-400 transition duration-300">Library</a>
              </li>
              <li>
                <a href="#" className="text-lg hover:text-purple-400 transition duration-300">More</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* <main className="py-8">
        <div className="container mx-auto">
          <h2 className="text-xl mb-4">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300x200" alt="Video Thumbnail" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Video Title 1</h3>
                <p className="text-sm text-gray-400">Channel Name</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300x200" alt="Video Thumbnail" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Video Title 2</h3>
                <p className="text-sm text-gray-400">Channel Name</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300x200" alt="Video Thumbnail" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Video Title 3</h3>
                <p className="text-sm text-gray-400">Channel Name</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300x200" alt="Video Thumbnail" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Video Title 3</h3>
                <p className="text-sm text-gray-400">Channel Name</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300x200" alt="Video Thumbnail" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Video Title 3</h3>
                <p className="text-sm text-gray-400">Channel Name</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300x200" alt="Video Thumbnail" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Video Title 3</h3>
                <p className="text-sm text-gray-400">Channel Name</p>
              </div>
            </div>
          </div>
        </div>
      </main> */}


      <p>Jokes: {jokes.length}</p>
      {
        jokes.map((joke, index) => (
          <p key={index}>{joke.joke}</p>
        ))
      }


      <footer className="bg-gray-800 p-6 mt-8">
        <div className="container mx-auto text-center ">
          <div className="flex justify-center space-x-8 mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            <a href="#" className="hover:text-purple-400 transition duration-300">About</a>
            <a href="#" className="hover:text-purple-400 transition duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition duration-300">Terms of Service</a>
            <a href="#" className="hover:text-purple-400 transition duration-300">Help</a>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-white hover:text-purple-400 transition duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white hover:text-purple-400 transition duration-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-purple-400 transition duration-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-white hover:text-purple-400 transition duration-300">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
          <p className="text-sm bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            &copy; 2024 VideoStream. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
