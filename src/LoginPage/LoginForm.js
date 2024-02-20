// LoginForm.js

import React, { useState } from 'react';
import './LoginForm.css'; 
import googleLogo from './google.webp'; 
import facebookLogo from './facebook.png';

const LoginForm = ({ logo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Login submitted for:', email);
  };

  return (
    <div className="login-container">
      <div className="form-box"> {}
        {logo && <img src={logo} alt="Company Logo" className="company-logo" />}
        <h1>Welcome to FIT INC</h1>
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
              <a href="#" className="forgot-link">Forgot password?</a>
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
            Need an account? <a href="#" className="signup-link" style={{ textDecoration: 'underline', color: '#007bff' }}>SIGN UP</a>

            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
