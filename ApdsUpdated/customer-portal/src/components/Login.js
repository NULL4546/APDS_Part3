// src/components/Login.js 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook to redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Input validation using RegEx
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/; // Alphanumeric, 3-20 characters
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/; // At least 8 characters, letters and numbers

    if (!usernameRegex.test(username)) {
      setError('Invalid username. It should be 3-20 alphanumeric characters.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Invalid password. It should be at least 8 characters long and include both letters and numbers.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      // Store JWT token in localStorage
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="username">Username:</label>
        <input 
          type="text" 
          id="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter your username"
          required 
        />

        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password"
          required 
        />

        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
