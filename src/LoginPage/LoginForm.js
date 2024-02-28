// LoginForm.js

import React, { useState } from 'react';
import './LoginForm.css'; 
import googleLogo from './google.webp'; 
import facebookLogo from './facebook.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link component

const LoginForm = ({ logo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold login error message
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message on new submission
  
    try {
      const response = await fetch('http://localhost:9191/login', { // response from backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json(); // Assuming the response is always JSON
      console.log('Response data:', data); // Debugging: Inspect the full response
  
      if (response.ok && data.status) {
        console.log('Login successful:', data);
        // Optionally store user data or token if provided
        // Example: localStorage.setItem('user', JSON.stringify(data.user));
        redirectToDashboard(); // Adjust this function to use React Router for navigation
      } else {
        // Use the message from the backend for failed login attempts
        setError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again later.');
    }
  };
  
  

  // Redirecting to dashboard
  const redirectToDashboard = () => {
    navigate('/dashboard'); // Use navigate function for redirection
  };



  return (
    <div className="login-container">
      <div className="form-box"> {}
        {logo && <img src={logo} alt="Company Logo" className="company-logo" />}
        <h1>Welcome to FIT INC</h1>
        {error && <div className="error-message">{error}</div>} {/* Display error message if login fails */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email" // Placeholder text added here
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password" // Placeholder text added here
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="forgot-password">
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
          </div>
          <button type="submit" className="login-button">Log In</button>
            <div className="auth-separator">
            <hr className="line" />or login with<hr className="line" />
            </div>
            <div className="social-logins">
            <button type="button" className="social-login google">
                <img src={googleLogo} alt="Google" /> Google
            </button>
            <button type="button" className="social-login facebook">
                <img src={facebookLogo} alt="Facebook" /> Facebook
            </button>
            </div>
            <div className="signup-prompt">
            Need an account? <Link to="/signup" className="signup-link" style={{ textDecoration: 'underline', color: '#007bff' }}>SIGN UP</Link>

            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
