import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import facebookLogo from './facebook.png';
import googleLogo from './google.webp';

const LoginForm = ({ logo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 

  useEffect(() => {
    checkAndRedirect();
  }, []); 
  
  const checkAndRedirect = async() => {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('data')){
      const encodedData = urlParams.get('data');
      const decodedData = JSON.parse(decodeURIComponent(encodedData));
      console.log(decodedData);
      const response = await fetch(`https://login-service.azurewebsites.net/login/checkOAuth2?email=${decodedData.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(!response.ok){
        if(response.status == 400){
          setError('User is not registered as an OAuth user. Try logging in with FitInc account');
        }
      }
      const data = await response.json();
      if(data == "Registration"){
        navigate('/signup/OAuth', { state: { email: decodedData.email, fname: decodedData.given_name, lname: decodedData.family_name, isOAuth: true  } });        
      }
      else if(data == "Login"){
        try {
          const response = await fetch('https://login-service.azurewebsites.net/login', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: decodedData.email, password: '', isOAuth: true }),
          });
      
          const data = await response.text(); 
      
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
    
            redirectToDashboard(user); 
    
          } else {
            setError(data.message || 'Invalid username or password');
          }
        } catch (error) {
          console.error('Login error:', error);
          setError('An error occurred. Please try again later.');
        }
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message on new submission
    const isOAuth = false;
    try {
      const response = await fetch('https://login-service.azurewebsites.net/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, isOAuth }),
      });
  
      const data = await response.json(); 
  
      if (response.ok && data.status) {
        console.log('Login successful:', data);
        const user = data.user;
        const fullName = `${user.fname} ${user.lname}`;

        localStorage.setItem('user', JSON.stringify({
          userId: user.id,
          username: user.username,
          fname: user.fname,
          mname: user.mname,
          lname: user.lname,
          dob: user.dob,
          gender: user.gender,
          email: user.email,
          fullName: fullName,
          role: user.role
          ,token: data.token
        }));
      
        const storedUserData = JSON.parse(localStorage.getItem('user'));
        console.log("Stored user data:", storedUserData);

        redirectToDashboard(user); 

      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again later.');
    }
  };
  

  // Redirecting to dashboard
  const redirectToDashboard = (user) => {
    if(String(user.role) === "USER"){
      navigate('/userdashboard'); 
    }
    else if(String(user.role) === "PROFESSIONAL"){
      navigate('/professionaldashboard');
    } 
    else if(String(user.role) === "ADMIN"){
      navigate('/admindashboard');
    }
    else{
      throw Object.assign( new Error("Invalid Role"), 
      { code: 402 });
    } 
  };


const handleOAuth2Login = async (url) => {
  try {
      window.location.href = url;
    } catch (error) {
      console.error('OAuth2 login error:', error);
    }
};
  
async function oauth(){
  const response = await fetch('https://oauthlogin-service.azurewebsites.net/request',
  {method: 'post'});
  const data = await response.json();
  handleOAuth2Login(data.url);
}

  return (
    <div className="login-container">
      <div className="form-box">
        {logo && <img src={logo} alt="Company Logo" className="company-logo" />}
        <h1>Welcome to FIT INC</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
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
            <button type="button" className="social-login google" onClick={() => oauth()}>
              <img src={googleLogo} alt="Google" /> Google
            </button>
            <button type="button" className="social-login facebook" onClick={() => handleOAuth2Login('facebook')}>
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
