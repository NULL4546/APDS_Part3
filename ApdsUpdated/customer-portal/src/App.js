// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard'; // Renamed Payments to Dashboard
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import './App.css'; // Ensure CSS is correctly imported

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Optional Home route, redirect to login */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
