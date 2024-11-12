// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the children components (protected routes)
  return children;
}

export default PrivateRoute;
