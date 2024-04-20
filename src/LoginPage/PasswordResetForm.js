import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  //http://localhost:8080/password-reset
  //https://login-service.azurewebsites.net/password-reset
    fetch('https://login-service.azurewebsites.net/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => {
      console.log("Response received:", response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log("Data parsed from response:", data);
      setIsError(false); // It's a success message
      setMessage('A password reset link has been sent to your email.');
      setTimeout(() => navigate('/login'), 8000); // Redirect to login after 8 seconds
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setIsError(true); // It's an error message
      setMessage('An error occurred. Please try again later.');
    });
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h1>Password Reset</h1>
        {message && <div className={isError ? "error-message" : "success-message"}>{message}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">Reset Password</button>
          <button type="button" className="forgot-link" onClick={() => navigate('/login')}>Return to Login</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetForm;
