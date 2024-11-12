// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Submitting registration:', { username, password });

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
      });
      alert('User registered successfully!');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error during registration:', error);
      console.log('Response data:', error.response?.data); // Log the response data
      setError(error.response?.data?.error || 'Registration failed!');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Register;
