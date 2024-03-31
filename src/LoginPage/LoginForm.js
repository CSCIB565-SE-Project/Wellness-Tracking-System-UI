// LoginForm.js

import React, { useState } from 'react';
import './LoginForm.css'; 
import googleLogo from './google.webp'; 
import facebookLogo from './facebook.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

const LoginForm = ({ logo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message on new submission
  
    try {
      // https://login-service.azurewebsites.net/login
      const response = await fetch('http://localhost:8080/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json(); 
  
      if (response.ok && data.status) {
        console.log('Login successful:', data);
        const user = data.user;
        const fullName = `${user.fname} ${user.lname}`;

        localStorage.setItem('user', JSON.stringify({
          userId: user.id,
          username: user.username,
          firstname: user.fname,
          lastname: user.lname,
          fullName: fullName,
          role: user.role
          ,token: data.token
        }));
      
        const storedUserData = JSON.parse(localStorage.getItem('user'));
        console.log("Stored user data:", storedUserData);

        redirectToDashboard(); 
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
    navigate('/dashboard'); 
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
