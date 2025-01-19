import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    // Validate the new password strength (example check, you can customize this)
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      // Assuming the user is logged in and you have the token saved in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in first');
        return;
      }
  
      const response = await axios.post('/api/v1/users/change-password', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        alert('Password changed successfully!');
      } else {
        alert('Password change failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during password change:', error.message);
      alert('An error occurred while changing the password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-4xl mb-6 font-semibold mb-14 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-8 py-3">
          <div>
            <label htmlFor="oldPassword" className="block text-2xl mb-2">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-2xl mb-2">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white"
              required
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white p-2 rounded-md">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
