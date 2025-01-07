import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-6 mt-8">
      <div className="container mx-auto text-center">
        {/* Navigation Links */}
        <div className="flex justify-center space-x-8 mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          <a
            href="#"
            className="hover:text-purple-400 transition duration-300"
          >
            About
          </a>
          <a
            href="#"
            className="hover:text-purple-400 transition duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-purple-400 transition duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-purple-400 transition duration-300"
          >
            Help
          </a>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="#"
            className="text-white hover:text-purple-400 transition duration-300"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-400 transition duration-300"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-400 transition duration-300"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-400 transition duration-300"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          &copy; 2024 VideoStream. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
