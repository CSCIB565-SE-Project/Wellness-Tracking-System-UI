import './SignupForm.css';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fname, setFirstName] = useState('');
    const [lname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [role, setUserRole] = useState('user'); 
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const token = searchParams.get('token'); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        try {
            const payload = {email, password, fname, lname, username, role};
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
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={fname}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lname}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>


          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>



                    <div className="form-group">
                        <select
                            value={role}
                            onChange={(e) => setUserRole(e.target.value)}
                            required
                        >
                            <option value="USER">User</option>
                            <option value="PROFESSIONAL">Professional</option>
                            <option value="ADMIN">Admin</option>

                        </select>
                    </div>
                    <button type="submit" className="login-button">Create Account</button>
                    <button type="button" className="forgot-link" onClick={() => navigate('/login')}>Return to Login</button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;