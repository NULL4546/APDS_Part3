// src/components/Dashboard.js
import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Update the CSS import if needed

function Dashboard() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // RegEx patterns for validation
  const cardNumberRegex = /^\d{16}$/; // Exactly 16 digits
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // MM/YY format
  const cvvRegex = /^\d{3,4}$/; // 3 or 4 digits

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Input validation using RegEx
    if (!cardNumberRegex.test(cardNumber)) {
      setError('Invalid card number. It should be exactly 16 digits.');
      return;
    }
    if (!expiryDateRegex.test(expiryDate)) {
      setError('Invalid expiry date. Use MM/YY format.');
      return;
    }
    if (!cvvRegex.test(cvv)) {
      setError('Invalid CVV. It should be 3 or 4 digits.');
      return;
    }

    setLoading(true);

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Send the payment data to the backend
      const response = await axios.post(
        'http://localhost:5000/process-payment', // Update with your actual endpoint
        {
          cardNumber,
          expiryDate,
          cvv,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );

      if (response.data.success) {
        setSuccess('Payment processed successfully!');
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
      } else {
        setError(response.data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during payment processing:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div>
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength="16"
            placeholder="1234567812345678"
            required
          />
        </div>

        <div>
          <label htmlFor="expiryDate">Expiry Date (MM/YY):</label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            required
          />
        </div>

        <div>
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength="4"
            placeholder="123"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
}

export default Dashboard;
