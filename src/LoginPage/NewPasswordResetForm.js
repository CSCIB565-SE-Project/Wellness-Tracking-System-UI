// NewPasswordResetForm.js

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const NewPasswordResetForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Assuming the URL includes something like ?token=abc

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    // Implement the API call to your backend
    try {
      console.log("Sending password:", password);
      const response = await fetch('http://login-service.azurewebsites.net/password-reset/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Your password has been reset successfully.');
        setTimeout(() => navigate('/login'), 5000); // Redirect to login after 5 seconds
      } else {
        setMessage(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h1>Reset Your Password</h1>
        {message && <div className="error-message">{message}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordResetForm;
