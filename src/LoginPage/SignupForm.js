import './LoginForm.css';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('user'); // default value
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
        try {
            const payload = {email, password, firstName, lastName, username, userRole};
            console.log("Sending payload:", payload);
            const response = await fetch('http://localhost:9191/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Your account has been created successfully.');
                setTimeout(() => navigate('/'), 5000); // Redirect to login after 5 seconds
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
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
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
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            required
                        >
                            <option value="user">User</option>
                            <option value="professional">Professional</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="login-button">Create Account</button>
                    <button type="button" className="forgot-link" onClick={() => navigate('/')}>Return to Login</button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;