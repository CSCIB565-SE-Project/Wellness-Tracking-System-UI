import './SignupForm.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthSignupForm = () => {
  const [email, setEmail] = useState('');
  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setUserRole] = useState('user'); 
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email: preloadedEmail, fname: preloadedFirstName, lname: preloadedLastName, isOAuth } = location.state || {};
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  useEffect(() => {
    if (isOAuth) {
      setEmail(preloadedEmail || '');
      setFirstName(preloadedFirstName || '');
      setLastName(preloadedLastName || '');
    }
  }, [isOAuth, preloadedEmail, preloadedFirstName, preloadedLastName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { email, fname, lname, username, role, isOAuth };
      console.log("Sending payload:", payload);
      const response = await fetch('https://login-service.azurewebsites.net/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log(response);

      const data = await response;
      if (response.ok) {
        setMessage('Your account has been created successfully.');
        setTimeout(() => navigate('/login'), 500); // Redirect to login after 5 seconds
      } else {
        setMessage(data.message || 'Failed to create account.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h1>Sign Up</h1>
        {message && <div className="error-message">{message}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Form fields go here */}
          <button type="submit" className="login-button">Create Account</button>
          <button type="button" className="forgot-link" onClick={() => navigate('/login')}>Return to Login</button>
        </form>
      </div>
    </div>
  );
};

export default OAuthSignupForm;
